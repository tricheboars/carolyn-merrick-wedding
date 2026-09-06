// Carolyn & Merrick — services API.
// RSVP + cash-registry acknowledgements persist to SQLite (Node's built-in
// node:sqlite — no native build). Admin list/CSV. Twilio SMS webhook stubbed
// until the toll-free number is provisioned (see docs/05-sms-cost.md).
try { require("dotenv").config(); } catch (_) {}

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Fastify = require("fastify");
const { DatabaseSync } = require("node:sqlite");
const ExcelJS = require("exceljs");   // the couple's spreadsheet download (write-only use)

// trustProxy: nginx runs on the same container and proxies from 127.0.0.1, so
// without this every request in the world logs (and rate-limits) as localhost.
const app = Fastify({ logger: true, trustProxy: true });

// --- DB --------------------------------------------------------------------
const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "app.db"));
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
// SMS opt-ins added 2026-08-22: CREATE TABLE IF NOT EXISTS never touches an
// existing table, so the deployed DBs (real guest rows on prod) get the new
// columns here. ADD COLUMN with a DEFAULT is safe and instant in SQLite.
for (const col of ["sms_updates", "sms_excursions"]) {
  const have = db.prepare("SELECT 1 FROM pragma_table_info('rsvps') WHERE name = ?").get(col);
  if (!have) db.exec(`ALTER TABLE rsvps ADD COLUMN ${col} INTEGER DEFAULT 0`);
}

// --- CORS (dev only; prod is same-origin behind HAProxy) -------------------
const DEV_ORIGINS = new Set([
  "http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:8081"
]);
app.addHook("onRequest", (req, reply, done) => {
  // Nothing this API returns may be cached anywhere between us and the browser.
  // Cloudflare caches by URL extension, and .csv/.xlsx are on its default list: an
  // authenticated download of /api/admin/rsvps.csv was served from the edge to an
  // unauthenticated request for 4 hours (reproduced on dev, 2026-09-06). Cloudflare
  // honours private/no-store, so this one header, on every response, is the fix.
  reply.header("Cache-Control", "private, no-store");
  const o = req.headers.origin;
  if (o && DEV_ORIGINS.has(o)) {
    reply.header("Access-Control-Allow-Origin", o);
    reply.header("Access-Control-Allow-Credentials", "true");   // the sign-in cookie, local dev only
    reply.header("Vary", "Origin");
    reply.header("Access-Control-Allow-Headers", "content-type,x-admin-token");
    reply.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }
  // Only short-circuit preflight for paths we actually serve; anything else
  // should fall through and 404 like a normal unknown route.
  if (req.method === "OPTIONS" && /^\/(api\/|sms)/.test(req.url)) {
    return reply.code(204).send();
  }
  done();
});

// --- rate limiting (in-memory sliding window, per client IP) ---------------
// Generous on purpose: a whole family behind one hotel NAT must not get locked
// out. It only exists to stop scripted abuse of the unauthenticated POSTs.
const HITS = new Map();
function rateLimited(key, limit, windowMs) {
  const now = Date.now();
  const fresh = (HITS.get(key) || []).filter((t) => now - t < windowMs);
  fresh.push(now);
  HITS.set(key, fresh);
  if (HITS.size > 5000) {                      // cheap unbounded-growth guard
    for (const [k, v] of HITS) if (!v.some((t) => now - t < windowMs)) HITS.delete(k);
  }
  return fresh.length > limit;
}
// Cloudflare overwrites CF-Connecting-IP on every request it proxies, so it is the
// one client address we can trust here. req.ip (from X-Forwarded-For) is the fallback
// for LAN/origin traffic. Without this every guest on the internet shared one bucket,
// because nginx and HAProxy are the only peers the socket ever sees.
function clientKey(req) {
  const cf = req.headers["cf-connecting-ip"];
  return (typeof cf === "string" && cf.length && cf.length < 64) ? cf : req.ip;
}
function limit(req, reply, bucket, max, windowMs) {
  const who = clientKey(req);
  if (!rateLimited(`${bucket}:${who}`, max, windowMs)) return false;
  req.log.warn({ ip: who, bucket }, "rate limited");
  reply.code(429).send({ error: "too many requests, please try again shortly" });
  return true;
}

// --- input hygiene ---------------------------------------------------------
// Strip C0/C7 control characters and bidi overrides; they corrupt CSV rows and
// can disguise what a name actually says. Newlines survive in free-text fields.
function clean(v, { multiline = false } = {}) {
  if (v === undefined || v === null) return null;
  let s = String(v);
  // C0/C7 controls: keep \n \r \t in free text, collapse them to a space elsewhere.
  s = multiline ? s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
                : s.replace(/[\x00-\x1F\x7F]/g, " ");
  s = s.replace(/[\u202A-\u202E\u2066-\u2069]/g, "").replace(/\s+$/g, "").replace(/^\s+/g, "");
  return s.length ? s : null;
}
// Email vs phone, and a sanity floor so junk like "' OR 1=1 --" can't land in
// guests.phone — the column the Twilio layer will dial.
function contactKind(c) {
  const s = String(c || "").trim();
  if (s.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) ? "email" : null;
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 ? "phone" : null;
}
const MAX_PARTY = 20;

// --- admin auth ------------------------------------------------------------
// FAILS CLOSED. The old "no token → localhost only" fallback was a no-op behind
// the reverse proxy (nginx proxies from 127.0.0.1 on this same box), so a
// missing ADMIN_TOKEN published the entire guest list to the internet.
//
// Two ways in: the x-admin-token header (Patrick, scripts) or the couple's
// sign-in cookie below. A request that sends the header is judged on the header
// alone; anything else needs a valid cookie. Neither has a fallback.
function tokenOK(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    req.log.error("ADMIN_TOKEN is not set — refusing token auth");
    return false;
  }
  const given = req.headers["x-admin-token"];
  if (typeof given !== "string" || given.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(token));
}
function adminOK(req) {
  if (typeof req.headers["x-admin-token"] === "string") return tokenOK(req);
  return readSession(req) !== null;
}
function requireAdmin(req, reply) {
  if (limit(req, reply, "admin", 30, 10 * 60 * 1000)) return false;
  if (!adminOK(req)) { reply.code(401).send({ error: "unauthorized" }); return false; }
  return true;
}

// --- the couple's sign-in (passphrase → signed cookie) ----------------------
// Carolyn and Merrick read the guest list at /admin/ on their phones, and a
// browser cannot send x-admin-token. So ADMIN_PASSPHRASE exchanges for an
// HMAC-signed, HttpOnly cookie (keyed by SESSION_SECRET) that the admin routes
// accept. Stateless on purpose: no sessions table, and rotating SESSION_SECRET
// signs everyone out. A missing or placeholder secret disables sign-in (503);
// the token path is unaffected.
const COOKIE = "cm_admin";
const SESSION_DAYS = 30;
function sessionSecret() {
  const s = process.env.SESSION_SECRET;
  return (typeof s === "string" && s.length >= 32 && !/change-me/i.test(s)) ? s : null;
}
// "Harbor Poppy Linen Tide", "harbor-poppy linen  tide" and "harbor poppy linen tide"
// are one passphrase: phones capitalise the first word and swap hyphens for
// spaces, and neither is a typo worth locking someone out over.
function normPass(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}
function hmac(secret, body) {
  return crypto.createHmac("sha256", secret).update(body).digest("base64url");
}
function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmac(sessionSecret(), body)}`;
}
function readSession(req) {
  const secret = sessionSecret();
  const raw = parseCookies(req)[COOKIE];
  if (!secret || typeof raw !== "string") return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;
  const body = raw.slice(0, dot), mac = raw.slice(dot + 1), want = hmac(secret, body);
  if (mac.length !== want.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(want))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return (p && typeof p.exp === "number" && p.exp * 1000 > Date.now()) ? p : null;
  } catch (_) { return null; }
}
// Secure is dropped only for the 11ty dev server (http://localhost:8080 → :3000);
// on dev and prod the page is always https via Cloudflare. SameSite=Lax lets a
// plain <a href> to the spreadsheet carry the cookie while keeping it off every
// cross-site request that is not a top-level navigation.
function cookieAttrs(req, maxAge) {
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(String(req.headers.host || ""));
  return `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${local ? "" : "; Secure"}`;
}

const loginSchema = {
  body: { type: "object", required: ["passphrase"],
          properties: { passphrase: { type: "string", minLength: 1, maxLength: 200 } } }
};
app.post("/api/auth/login", { schema: loginSchema }, async (req, reply) => {
  // Per client: a human with a typo never reaches 5 tries in 15 minutes. Global:
  // turns a distributed guessing run into a logged, throttled non-event without
  // ever locking the couple out for good.
  if (limit(req, reply, "login", 5, 15 * 60 * 1000)) return;
  if (rateLimited("login:*", 120, 60 * 60 * 1000)) {
    req.log.warn({ ip: clientKey(req) }, "global sign-in throttle");
    return reply.code(429).send({ error: "too many sign-in attempts right now, please try again later" });
  }
  const want = normPass(process.env.ADMIN_PASSPHRASE);
  if (!want || !sessionSecret()) {
    req.log.error("ADMIN_PASSPHRASE / SESSION_SECRET missing or placeholder — sign-in disabled");
    return reply.code(503).send({ error: "sign-in is not set up yet" });
  }
  const given = normPass(req.body.passphrase);
  const ok = given.length === want.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(want));
  if (!ok) {
    req.log.warn({ ip: clientKey(req) }, "sign-in failed");
    return reply.code(401).send({ error: "that passphrase did not match" });
  }
  const now = Math.floor(Date.now() / 1000), exp = now + SESSION_DAYS * 86400;
  reply.header("Set-Cookie",
    `${COOKIE}=${signSession({ who: "couple", iat: now, exp })}; ${cookieAttrs(req, SESSION_DAYS * 86400)}`);
  req.log.info({ ip: clientKey(req) }, "sign-in ok");
  return { ok: true, who: "couple", exp };
});
app.post("/api/auth/logout", async (req, reply) => {
  reply.header("Set-Cookie", `${COOKIE}=; ${cookieAttrs(req, 0)}`);
  return { ok: true };
});
app.get("/api/auth/session", async (req, reply) => {
  const s = readSession(req);
  if (!s) return reply.code(401).send({ ok: false });
  return { ok: true, who: s.who, exp: s.exp };
});

// --- health / info ---------------------------------------------------------
app.get("/health", async (req, reply) => {
  let dbOK = false;
  try { db.prepare("SELECT 1").get(); dbOK = true; } catch (e) { req.log.error(e); }
  if (!dbOK) return reply.code(503).send({ ok: false, db: false, ts: new Date().toISOString() });
  return { ok: true, db: true, ts: new Date().toISOString() };
});
app.get("/api/info", async () => ({
  couple: "Carolyn & Merrick", date: "2027-08-14", venue: "The Harpswell Inn, Harpswell, ME"
}));

// --- RSVP ------------------------------------------------------------------
const rsvpSchema = {
  body: {
    type: "object",
    required: ["name", "contact", "attending"],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 200 },
      contact: { type: "string", minLength: 1, maxLength: 200 },
      attending: { type: "string", enum: ["yes", "no"] },
      party: { type: ["integer", "string"] },
      meal: { type: "string", maxLength: 100 },
      diet: { type: "string", maxLength: 500 },
      song: { type: "string", maxLength: 200 },
      message: { type: "string", maxLength: 1000 },
      sms_updates: { type: "string", maxLength: 10 },
      sms_excursions: { type: "string", maxLength: 10 }
    }
  }
};
app.post("/api/rsvp", { schema: rsvpSchema }, async (req, reply) => {
  if (limit(req, reply, "rsvp", 20, 10 * 60 * 1000)) return;
  const b = req.body;

  const name = clean(b.name);
  const contact = clean(b.contact);
  if (!name || !contact) {
    return reply.code(400).send({ error: "name and contact are required", field: !name ? "name" : "contact" });
  }
  const kind = contactKind(contact);
  if (!kind) {
    return reply.code(400).send({ error: "that does not look like an email address or phone number", field: "contact" });
  }
  const asked = parseInt(b.party, 10);
  const party = Math.min(MAX_PARTY, Math.max(1, Number.isFinite(asked) ? asked : 1));
  if (Number.isFinite(asked) && asked > MAX_PARTY) {
    req.log.warn({ asked, ip: clientKey(req) }, "party size clamped");
  }
  const fields = {
    meal: clean(b.meal), diet: clean(b.diet, { multiline: true }),
    song: clean(b.song), message: clean(b.message, { multiline: true }),
    // Unchecked boxes never reach the payload, so absence = 0. A re-submit with a
    // box now unchecked therefore correctly withdraws that consent on UPDATE.
    smsUpdates: b.sms_updates ? 1 : 0, smsExcursions: b.sms_excursions ? 1 : 0
  };

  // Re-submitting is how the RSVP page tells guests to change their answer, so
  // the same person must UPDATE their row, not stack a second one on the
  // headcount. Identity = name + contact, both normalized.
  const nameKey = name.toLowerCase().replace(/\s+/g, " ");
  const contactKey = contact.toLowerCase().replace(/\s+/g, "");
  try {
    db.exec("BEGIN");
    const prior = db.prepare(
      `SELECT g.id AS guest_id, r.id AS rsvp_id
         FROM guests g
         LEFT JOIN rsvps r ON r.guest_id = g.id
        WHERE lower(trim(g.full_name)) = ?
          AND replace(lower(trim(coalesce(g.email, g.phone, ''))), ' ', '') = ?
        ORDER BY r.id DESC LIMIT 1`
    ).get(nameKey, contactKey);

    let rsvpId, updated = false;
    if (prior && prior.rsvp_id) {
      db.prepare(
        `UPDATE rsvps SET attending=?, party_size=?, meal=?, dietary=?, song=?, message=?,
                          sms_updates=?, sms_excursions=?, responded_at=datetime('now')
          WHERE id=?`
      ).run(b.attending, party, fields.meal, fields.diet, fields.song, fields.message,
            fields.smsUpdates, fields.smsExcursions, prior.rsvp_id);
      rsvpId = prior.rsvp_id;
      updated = true;
    } else {
      let gid = prior && prior.guest_id;
      if (!gid) {
        const hh = db.prepare("INSERT INTO households (name) VALUES (?)").run(name);
        const g = db.prepare(
          "INSERT INTO guests (household_id, full_name, email, phone) VALUES (?,?,?,?)"
        ).run(Number(hh.lastInsertRowid), name,
              kind === "email" ? contact : null, kind === "phone" ? contact : null);
        gid = Number(g.lastInsertRowid);
      }
      const r = db.prepare(
        `INSERT INTO rsvps (guest_id, attending, party_size, meal, dietary, song, message,
                            sms_updates, sms_excursions)
         VALUES (?,?,?,?,?,?,?,?,?)`
      ).run(gid, b.attending, party, fields.meal, fields.diet, fields.song, fields.message,
            fields.smsUpdates, fields.smsExcursions);
      rsvpId = Number(r.lastInsertRowid);
    }
    db.exec("COMMIT");
    req.log.info({ rsvp: rsvpId, attending: b.attending, updated }, "rsvp saved");
    return { ok: true, id: rsvpId, updated };
  } catch (e) {
    try { db.exec("ROLLBACK"); } catch (_) {}
    req.log.error(e);
    return reply.code(500).send({ error: "could not save RSVP" });
  }
});

// --- Registry acknowledgement (cash / house fund) --------------------------
const ackSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 200 },
      method: { type: "string", maxLength: 50 },
      note: { type: "string", maxLength: 1000 }
    }
  }
};
app.post("/api/registry/ack", { schema: ackSchema }, async (req, reply) => {
  if (limit(req, reply, "ack", 20, 10 * 60 * 1000)) return;
  const name = clean(req.body.name);
  if (!name) return reply.code(400).send({ error: "name required", field: "name" });
  try {
    const r = db.prepare(
      "INSERT INTO registry_contributions (name, method, note) VALUES (?,?,?)"
    ).run(name, clean(req.body.method), clean(req.body.note, { multiline: true }));
    req.log.info({ ack: Number(r.lastInsertRowid) }, "registry ack saved");
    return { ok: true, id: Number(r.lastInsertRowid) };
  } catch (e) {
    req.log.error(e);
    return reply.code(500).send({ error: "could not save that just now" });
  }
});

// --- Admin (token via x-admin-token; no token set = everything refused) -----
// CSV cells starting with = + - @ are prefixed with ' so Excel/Sheets treat a
// guest's name as text instead of running it as a formula. BOM keeps accents
// and emoji intact in Excel on Windows.
function toCSV(cols, rows) {
  const esc = (v) => {
    const s = String(v ?? "");
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
}

const RSVP_SELECT =
  `SELECT r.id, g.full_name, g.email, g.phone, r.attending, r.party_size,
          r.meal, r.dietary, r.song, r.message, r.sms_updates, r.sms_excursions,
          r.responded_at
   FROM rsvps r JOIN guests g ON g.id = r.guest_id ORDER BY r.responded_at DESC`;

app.get("/api/admin/rsvps", async (req, reply) => {
  if (!requireAdmin(req, reply)) return;
  const rows = db.prepare(RSVP_SELECT).all();
  const attending = rows.filter((x) => x.attending === "yes");
  const heads = attending.reduce((n, x) => n + (x.party_size || 1), 0);
  return { count: rows.length, attending: attending.length, headcount: heads, rsvps: rows };
});

app.get("/api/admin/rsvps.csv", async (req, reply) => {
  if (!requireAdmin(req, reply)) return;
  const rows = db.prepare(RSVP_SELECT).all();
  reply.header("content-type", "text/csv; charset=utf-8")
       .header("content-disposition", 'attachment; filename="rsvps.csv"');
  return toCSV(["full_name","email","phone","attending","party_size","meal","dietary","song","message","sms_updates","sms_excursions","responded_at"], rows);
});

// Registry acks were write-only until now: the page promises the couple will
// thank you, so they need a way to actually read who said they gave.
const ACK_SELECT =
  "SELECT id, name, method, note, acknowledged_at FROM registry_contributions ORDER BY acknowledged_at DESC";

app.get("/api/admin/registry", async (req, reply) => {
  if (!requireAdmin(req, reply)) return;
  const rows = db.prepare(ACK_SELECT).all();
  return { count: rows.length, contributions: rows };
});

app.get("/api/admin/registry.csv", async (req, reply) => {
  if (!requireAdmin(req, reply)) return;
  const rows = db.prepare(ACK_SELECT).all();
  reply.header("content-type", "text/csv; charset=utf-8")
       .header("content-disposition", 'attachment; filename="registry.csv"');
  return toCSV(["name","method","note","acknowledged_at"], rows);
});

// The couple's spreadsheet (/admin/ "Download spreadsheet"): one .xlsx with an
// RSVPs sheet and a Gift notes sheet, styled to read on a phone. No extension in
// the URL on purpose (.xlsx is on Cloudflare's default cache list as well), on
// top of the no-store header every response already carries.
const EASTERN = { timeZone: "America/New_York" };
function eastern(s) {
  if (!s) return "";
  const d = new Date(String(s).replace(" ", "T") + "Z");   // SQLite datetime('now') is UTC
  return Number.isNaN(d.getTime()) ? String(s)
       : d.toLocaleString("en-US", { ...EASTERN, month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}
async function buildWorkbook(rows, acks) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "merrolyn.com";
  const FONT = { name: "Arial", size: 11 };
  const BOLD = { ...FONT, bold: true };
  const NOTE = { name: "Arial", size: 10, italic: true, color: { argb: "FF555555" } };
  const TITLE = { name: "Arial", size: 14, bold: true, color: { argb: "FF5A1F2B" } };
  const HEAD_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3E6E9" } };
  const RULE = { bottom: { style: "thin", color: { argb: "FFD9C7CC" } } };
  const WRAP = { wrapText: true, vertical: "top" };
  const stamp = eastern(new Date().toISOString().slice(0, 19).replace("T", " "));
  const yn = (v) => (v ? "Yes" : "No");

  // Header row + data rows + frozen header + filter arrows. Strings stay strings
  // in exceljs (a value of "=1+1" is text, never a formula), so no CSV-style quoting.
  function table(ws, start, headers, widths, data, { wrap = [], center = [] } = {}) {
    headers.forEach((h, i) => {
      const c = ws.getCell(start, i + 1);
      c.value = h; c.font = BOLD; c.fill = HEAD_FILL; c.border = RULE; c.alignment = WRAP;
      ws.getColumn(i + 1).width = widths[i];
    });
    data.forEach((vals, r) => vals.forEach((v, i) => {
      const c = ws.getCell(start + 1 + r, i + 1);
      c.value = v ?? ""; c.font = FONT;
      c.alignment = wrap.includes(i) ? WRAP
                  : center.includes(i) ? { horizontal: "center", vertical: "top" } : { vertical: "top" };
    }));
    ws.views = [{ state: "frozen", ySplit: start }];
    ws.autoFilter = { from: { row: start, column: 1 }, to: { row: start + Math.max(data.length, 1), column: headers.length } };
  }

  const ws = wb.addWorksheet("RSVPs");
  ws.getCell("A1").value = "Carolyn + Merrick RSVPs (merrolyn.com)"; ws.getCell("A1").font = TITLE;
  ws.getCell("A2").value = `Downloaded ${stamp} Eastern. Times are Eastern. Newest first.`; ws.getCell("A2").font = NOTE;
  const attending = rows.filter((r) => r.attending === "yes");
  const summary = [
    ["Replies", rows.length],
    ["Attending", attending.length],
    ["Not attending", rows.length - attending.length],
    ["Headcount (sum of party sizes)", attending.reduce((n, r) => n + (r.party_size || 1), 0)],
    ["Opted into wedding-update texts", rows.filter((r) => r.sms_updates).length],
    ["Opted into excursion texts", rows.filter((r) => r.sms_excursions).length]
  ];
  summary.forEach(([k, v], i) => {
    ws.getCell(4 + i, 1).value = k; ws.getCell(4 + i, 1).font = BOLD;
    ws.getCell(4 + i, 2).value = v; ws.getCell(4 + i, 2).font = FONT;
    ws.getCell(4 + i, 2).alignment = { horizontal: "left" };
  });
  table(ws, 4 + summary.length + 1,
    ["Name", "Email", "Phone", "Attending", "Party size", "Dietary notes", "Song request", "Message",
     "Wedding-update texts", "Excursion texts", "Responded (Eastern)"],
    [30, 30, 16, 11, 10, 30, 32, 40, 14, 12, 22],
    rows.map((r) => [r.full_name, r.email, r.phone, yn(r.attending === "yes"), r.party_size || 1, r.dietary, r.song,
                     r.message, yn(r.sms_updates), yn(r.sms_excursions), eastern(r.responded_at)]),
    { wrap: [5, 6, 7], center: [4] });

  const w2 = wb.addWorksheet("Gift notes");
  w2.getCell("A1").value = "House-fund gift notes (guests who told us they sent something)"; w2.getCell("A1").font = TITLE;
  w2.getCell("A2").value = `Downloaded ${stamp} Eastern. For thank-you notes; amounts are not collected.`; w2.getCell("A2").font = NOTE;
  table(w2, 4, ["Name", "Method", "Note", "Sent (Eastern)"], [28, 12, 70, 22],
    acks.map((a) => [a.name, a.method, a.note, eastern(a.acknowledged_at)]), { wrap: [2] });

  return Buffer.from(await wb.xlsx.writeBuffer());
}

app.get("/api/admin/export", async (req, reply) => {
  if (!requireAdmin(req, reply)) return;
  const buf = await buildWorkbook(db.prepare(RSVP_SELECT).all(), db.prepare(ACK_SELECT).all());
  const day = new Date().toLocaleDateString("en-CA", EASTERN);   // 2026-09-06
  reply.header("content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
       .header("content-disposition", `attachment; filename="Carolyn and Merrick RSVPs ${day}.xlsx"`);
  return buf;
});

// --- Twilio inbound SMS webhook (two-way Q&A) — stub until number is live --
// Registered on BOTH paths: nginx and every runbook route /sms-webhook, while
// the original code only listened on /sms/webhook, so inbound SMS would have
// 404'd whichever path Twilio was pointed at.
const smsWebhook = async (req, reply) => {
  reply.header("content-type", "text/xml");
  return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
};
app.post("/sms-webhook", smsWebhook);
app.post("/sms/webhook", smsWebhook);

// Bind to loopback only: nginx proxies from 127.0.0.1 on this same container,
// so listening on 0.0.0.0 just exposed the unauthenticated POSTs to the LAN.
const port = Number(process.env.PORT) || 3000;
const host = process.env.BIND_HOST || "127.0.0.1";
app.listen({ port, host }).catch((e) => { app.log.error(e); process.exit(1); });
