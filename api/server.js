// Carolyn & Merrick — services API.
// RSVP + cash-registry acknowledgements persist to SQLite (Node's built-in
// node:sqlite — no native build). Admin list/CSV. Twilio SMS webhook stubbed
// until the toll-free number is provisioned (see docs/05-sms-cost.md).
try { require("dotenv").config(); } catch (_) {}

const path = require("path");
const fs = require("fs");
const Fastify = require("fastify");
const { DatabaseSync } = require("node:sqlite");

const app = Fastify({ logger: true });

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
  if (req.method === "OPTIONS") return reply.code(204).send();
  done();
});

function adminOK(req) {
  const token = process.env.ADMIN_TOKEN;
  if (token) return req.headers["x-admin-token"] === token;
  return ["127.0.0.1", "::1"].includes(req.ip); // no token set → localhost only
}

// --- health / info ---------------------------------------------------------
app.get("/health", async () => ({ ok: true, db: true, ts: new Date().toISOString() }));
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
  const b = req.body;
  const party = Math.max(1, parseInt(b.party, 10) || 1);
  try {
    db.exec("BEGIN");
    const hh = db.prepare("INSERT INTO households (name) VALUES (?)").run(b.name);
    const hid = Number(hh.lastInsertRowid);
    const g = db.prepare(
      "INSERT INTO guests (household_id, full_name, email, phone) VALUES (?,?,?,?)"
    ).run(hid, b.name, b.contact.includes("@") ? b.contact : null,
              b.contact.includes("@") ? null : b.contact);
    const gid = Number(g.lastInsertRowid);
    const r = db.prepare(
      `INSERT INTO rsvps (guest_id, attending, party_size, meal, dietary, song, message)
       VALUES (?,?,?,?,?,?,?)`
    ).run(gid, b.attending, party, b.meal || null, b.diet || null, b.song || null, b.message || null);
    db.exec("COMMIT");
    req.log.info({ rsvp: Number(r.lastInsertRowid), attending: b.attending }, "rsvp saved");
    return { ok: true, id: Number(r.lastInsertRowid) };
  } catch (e) {
    db.exec("ROLLBACK");
    req.log.error(e);
    return reply.code(500).send({ error: "could not save RSVP" });
  }
});

// --- Registry acknowledgement (cash / house fund) --------------------------
app.post("/api/registry/ack", async (req, reply) => {
  const { name, method, note } = req.body || {};
  if (!name) return reply.code(400).send({ error: "name required" });
  const r = db.prepare(
    "INSERT INTO registry_contributions (name, method, note) VALUES (?,?,?)"
  ).run(name, method || null, note || null);
  return { ok: true, id: Number(r.lastInsertRowid) };
});

// --- Admin (token via x-admin-token, else localhost only) ------------------
app.get("/api/admin/rsvps", async (req, reply) => {
  if (!adminOK(req)) return reply.code(401).send({ error: "unauthorized" });
  const rows = db.prepare(
    `SELECT r.id, g.full_name, g.email, g.phone, r.attending, r.party_size,
            r.meal, r.dietary, r.song, r.message, r.responded_at
     FROM rsvps r JOIN guests g ON g.id = r.guest_id ORDER BY r.responded_at DESC`
  ).all();
  const attending = rows.filter((x) => x.attending === "yes");
  const heads = attending.reduce((n, x) => n + (x.party_size || 1), 0);
  return { count: rows.length, attending: attending.length, headcount: heads, rsvps: rows };
});

app.get("/api/admin/rsvps.csv", async (req, reply) => {
  if (!adminOK(req)) return reply.code(401).send({ error: "unauthorized" });
  const rows = db.prepare(
    `SELECT g.full_name, g.email, g.phone, r.attending, r.party_size,
            r.meal, r.dietary, r.song, r.message, r.responded_at
     FROM rsvps r JOIN guests g ON g.id = r.guest_id ORDER BY r.responded_at DESC`
  ).all();
  const cols = ["full_name","email","phone","attending","party_size","meal","dietary","song","message","responded_at"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  reply.header("content-type", "text/csv").header("content-disposition", 'attachment; filename="rsvps.csv"');
  return csv;
});

// --- Twilio inbound SMS webhook (two-way Q&A) — stub until number is live --
app.post("/sms/webhook", async (req, reply) => {
  reply.header("content-type", "text/xml");
  return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
});

const port = Number(process.env.PORT) || 3000;
app.listen({ port, host: "0.0.0.0" }).catch((e) => { app.log.error(e); process.exit(1); });
