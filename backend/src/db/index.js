import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dir, '..', '..', 'data.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    email     TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL,
    created_at TEXT   DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gabarito (
    question_id  TEXT PRIMARY KEY,
    correct      TEXT NOT NULL,
    disc         TEXT,
    source       TEXT DEFAULT 'created'
  );

  CREATE TABLE IF NOT EXISTS progress (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    question_id TEXT    NOT NULL,
    chosen      TEXT    NOT NULL,
    correct     INTEGER NOT NULL,
    answered_at TEXT    DEFAULT (datetime('now')),
    UNIQUE(user_id, question_id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id     INTEGER NOT NULL REFERENCES users(id),
    question_id TEXT    NOT NULL,
    PRIMARY KEY (user_id, question_id)
  );

  CREATE TABLE IF NOT EXISTS simulados (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    disc        TEXT,
    total       INTEGER NOT NULL,
    acertos     INTEGER NOT NULL,
    duration_s  INTEGER,
    created_at  TEXT    DEFAULT (datetime('now'))
  );
`);

export default db;
