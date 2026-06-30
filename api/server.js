// Carolyn & Merrick — services API (skeleton).
// Runs today: GET /health, GET /api/info. The rest are stubs to be built out
// (accounts, RSVP persistence, registry acknowledgements, Twilio two-way SMS).
try { require("dotenv").config(); } catch (_) {}

const path = require("path");
const fs = require("fs");
const Fastify = require("fastify");

const app = Fastify({ logger: true });

// Optional SQLite — the skeleton boots without it so /health always works.
let db = null;
try {
  const Database = require("better-sqlite3");
  const dataDir = path.join(__dirname, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(path.join(dataDir, "app.db"));
  db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
  app.log.info("SQLite ready");
} catch (e) {
  app.log.warn("better-sqlite3 not installed — running in skeleton mode (no DB)");
}

app.get("/health", async () => ({ ok: true, db: !!db, ts: new Date().toISOString() }));

app.get("/api/info", async () => ({
  couple: "Carolyn & Merrick",
  date: "2027-08-14",
  venue: "The Harpswell Inn, Harpswell, ME"
}));

// --- RSVP (skeleton) -------------------------------------------------------
app.post("/api/rsvp", async (req, reply) => {
  const { name, contact, attending } = req.body || {};
  if (!name || !attending) return reply.code(400).send({ error: "name and attending are required" });
  if (!db) return reply.code(501).send({ error: "DB not configured yet (skeleton mode)" });
  // TODO: resolve/link household, insert rsvp, fire confirmation SMS via Twilio.
  return reply.code(501).send({ error: "RSVP persistence not implemented yet" });
});

// --- Registry acknowledgement (cash / house fund) --------------------------
app.post("/api/registry/ack", async (req, reply) => {
  return reply.code(501).send({ error: "not implemented yet" });
});

// --- Twilio inbound SMS webhook (two-way guest Q&A) ------------------------
app.post("/sms/webhook", async (req, reply) => {
  // TODO: verify Twilio signature; handle STOP/HELP (consent); route Q&A.
  reply.header("content-type", "text/xml");
  return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
});

const port = Number(process.env.PORT) || 3000;
app.listen({ port, host: "0.0.0.0" }).catch((e) => {
  app.log.error(e);
  process.exit(1);
});
