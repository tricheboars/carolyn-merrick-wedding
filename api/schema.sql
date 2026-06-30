-- Carolyn & Merrick — guest-data schema (SQLite).
-- Informed by the stack research (docs/04): household→guests + magic-link (kegger),
-- RSVP fields (RajwanYair), and an SMS consent/message log for the Twilio layer.

CREATE TABLE IF NOT EXISTS households (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL,
  invite_code  TEXT UNIQUE,            -- per-household login (no passwords)
  created_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guests (
  id            INTEGER PRIMARY KEY,
  household_id  INTEGER REFERENCES households(id),
  full_name     TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  is_plus_one   INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS rsvps (
  id            INTEGER PRIMARY KEY,
  guest_id      INTEGER REFERENCES guests(id),
  attending     TEXT CHECK (attending IN ('yes','no')) NOT NULL,
  party_size    INTEGER DEFAULT 1,
  meal          TEXT,
  dietary       TEXT,
  song          TEXT,
  message       TEXT,
  responded_at  TEXT DEFAULT (datetime('now'))
);

-- Cash / house fund: we don't sell items, we just let guests tell us they gave
-- so the couple can send thank-yous.
CREATE TABLE IF NOT EXISTS registry_contributions (
  id               INTEGER PRIMARY KEY,
  name             TEXT,
  method           TEXT,               -- venmo / zelle / paypal / mail
  note             TEXT,
  acknowledged_at  TEXT DEFAULT (datetime('now'))
);

-- SMS opt-in consent (required for Twilio A2P / toll-free compliance).
CREATE TABLE IF NOT EXISTS sms_consent (
  id          INTEGER PRIMARY KEY,
  phone       TEXT UNIQUE NOT NULL,
  consented   INTEGER DEFAULT 0,
  consent_at  TEXT,
  opted_out   INTEGER DEFAULT 0
);

-- Full message log (outbound blasts + inbound two-way Q&A).
CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER PRIMARY KEY,
  phone       TEXT,
  direction   TEXT CHECK (direction IN ('out','in')),
  body        TEXT,
  status      TEXT,
  twilio_sid  TEXT,
  created_at  TEXT DEFAULT (datetime('now'))
);
