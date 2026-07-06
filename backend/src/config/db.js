// src/config/db.js
// Single SQLite connection (better-sqlite3 is synchronous, fast, and file-based —
// no separate database server to manage). Swap this file only if you later
// migrate to Postgres/MySQL; the rest of the app talks through models/*.js.

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const env = require('./env');

const dbDir = path.dirname(env.DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(env.DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ──────────────────────────────────────────────────
db.exec(`
CREATE TABLE IF NOT EXISTS parishes (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  diocese       TEXT,
  address       TEXT,
  phone         TEXT,
  email         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id                    TEXT PRIMARY KEY,
  parish_id             TEXT REFERENCES parishes(id) ON DELETE SET NULL,
  full_name             TEXT NOT NULL,
  email                 TEXT NOT NULL UNIQUE,
  password_hash         TEXT NOT NULL,
  role                  TEXT NOT NULL DEFAULT 'viewer'
                        CHECK (role IN ('super_admin','admin','secretary','viewer')),
  title                 TEXT,                 -- e.g. 'Katibu', 'Padre', 'Msimamizi'
  is_active             INTEGER NOT NULL DEFAULT 1,
  must_change_password  INTEGER NOT NULL DEFAULT 0,
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until          TEXT,
  last_login_at         TEXT,
  last_login_ip         TEXT,
  created_by            TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL,
  user_agent    TEXT,
  ip_address    TEXT,
  expires_at    TEXT NOT NULL,
  revoked_at    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS password_resets (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL,
  expires_at    TEXT NOT NULL,
  used_at       TEXT,
  requested_ip  TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id            TEXT PRIMARY KEY,
  actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  actor_email   TEXT,
  action        TEXT NOT NULL,       -- e.g. 'user.create', 'auth.login.success'
  target_type   TEXT,
  target_id     TEXT,
  metadata      TEXT,                -- JSON string
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS waumini (               -- parishioners
  id            TEXT PRIMARY KEY,
  parish_id     TEXT REFERENCES parishes(id) ON DELETE SET NULL,
  full_name     TEXT NOT NULL,
  gender        TEXT CHECK (gender IN ('me','ke')),
  date_of_birth TEXT,
  phone         TEXT,
  address       TEXT,
  notes         TEXT,
  created_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sakramenti (            -- sacrament records
  id              TEXT PRIMARY KEY,
  parish_id       TEXT REFERENCES parishes(id) ON DELETE SET NULL,
  mwumini_id      TEXT REFERENCES waumini(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('ubatizo','kipaimara','ekaristi','ndoa','upadre','mazishi')),
  event_date      TEXT NOT NULL,
  officiant       TEXT,               -- padre / mchungaji who performed the rite
  register_book   TEXT,               -- reference to the physical/digital "kitabu"
  register_page   TEXT,
  details         TEXT,               -- JSON string, sacrament-specific fields
  created_by      TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vitabu (                -- church registry "books" (categories)
  id            TEXT PRIMARY KEY,
  parish_id     TEXT REFERENCES parishes(id) ON DELETE SET NULL,
  code          TEXT NOT NULL,        -- e.g. 'ubatizo', 'ndoa'
  name_sw       TEXT NOT NULL,        -- Swahili label
  name_en       TEXT NOT NULL,        -- English label (for admin clarity)
  description   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (             -- scanned/captured files (certs, register pages, IDs)
  id            TEXT PRIMARY KEY,
  parish_id     TEXT REFERENCES parishes(id) ON DELETE SET NULL,
  kitabu_id     TEXT REFERENCES vitabu(id) ON DELETE SET NULL,
  owner_type    TEXT,                 -- 'mwumini' | 'sakramenti' | 'user' | 'general'
  owner_id      TEXT,
  file_name     TEXT NOT NULL,
  file_path     TEXT NOT NULL,
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  source        TEXT NOT NULL DEFAULT 'upload' CHECK (source IN ('upload','camera')),
  uploaded_by   TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_parish ON users(parish_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_reset_user ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_waumini_parish ON waumini(parish_id);
CREATE INDEX IF NOT EXISTS idx_sakramenti_mwumini ON sakramenti(mwumini_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_type, owner_id);
`);

module.exports = db;
