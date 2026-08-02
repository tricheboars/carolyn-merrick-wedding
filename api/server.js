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

// trustProxy: nginx runs on the same container and proxies from 127.0.0.1, so
// without this every request in the world logs (and rate-limits) as localhost.
const app = Fastify({ logger: true, trustProxy: true });

// --- DB --------------------------------------------------------------------
const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "app.db"));
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));

// --- CORS (dev only; prod is same-origin behind HAProxy) -------------------
const DEV_ORIGINS = new Set([
  "http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:8081"
]);
app.addHook("onRequest", (req, reply, done) => {
  const o = req.headers.origin;
  if (o && DEV_ORIGINS.has(o)) {
    reply.header("Access-Control-Allow-Origin", o);
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
function adminOK(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    req.log.error("ADMIN_TOKEN is not set — refusing all admin requests");
    return false;
  }
  const given = req.headers["x-admin-token"];
  if (typeof given !== "string" || given.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(token));
}
function requireAdmin(req, reply) {
  if (limit(req, reply, "admin", 30, 10 * 60 * 1000)) return false;
  if (!adminOK(req)) { reply.code(401).send({ error: "unauthorized" }); return false; }
  return true;
}

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
      message: { type: "string", maxLength: 1000 }
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
    song: clean(b.song), message: clean(b.message, { multiline: true })
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
                          responded_at=datetime('now')
          WHERE id=?`
      ).run(b.attending, party, fields.meal, fields.diet, fields.song, fields.message, prior.rsvp_id);
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
        `INSERT INTO rsvps (guest_id, attending, party_size, meal, dietary, song, message)
         VALUES (?,?,?,?,?,?,?)`
      ).run(gid, b.attending, party, fields.meal, fields.diet, fields.song, fields.message);
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
          r.meal, r.dietary, r.song, r.message, r.responded_at
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
  return toCSV(["full_name","email","phone","attending","party_size","meal","dietary","song","message","responded_at"], rows);
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
