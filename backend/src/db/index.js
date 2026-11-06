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

  CREATE TABLE IF NOT EXISTS concursos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nome       TEXT NOT NULL,
    data_prova TEXT,
    cor        TEXT DEFAULT '#b9ff66',
    ativo      INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS cursos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    titulo     TEXT NOT NULL,
    descricao  TEXT,
    cor        TEXT DEFAULT '#6366f1',
    criado_em  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS modulos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    curso_id  INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    titulo    TEXT NOT NULL,
    ordem     INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS aulas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    modulo_id    INTEGER NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
    titulo       TEXT NOT NULL,
    conteudo_md  TEXT DEFAULT '',
    duracao_min  INTEGER DEFAULT 0,
    ordem        INTEGER DEFAULT 0,
    criado_em    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS aula_progresso (
    user_id   INTEGER NOT NULL REFERENCES users(id),
    aula_id   INTEGER NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
    concluida INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, aula_id)
  );

  CREATE TABLE IF NOT EXISTS decks (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    titulo     TEXT NOT NULL,
    descricao  TEXT,
    cor        TEXT DEFAULT '#6366f1',
    auto_deck  INTEGER DEFAULT 0,
    criado_em  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS flashcards (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id    INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    frente     TEXT NOT NULL,
    verso      TEXT NOT NULL,
    source     TEXT DEFAULT 'manual',
    source_id  TEXT,
    criado_em  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS srs_state (
    user_id     INTEGER NOT NULL REFERENCES users(id),
    card_id     INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    intervalo   INTEGER DEFAULT 1,
    easiness    REAL    DEFAULT 2.5,
    repeticoes  INTEGER DEFAULT 0,
    proxima_rev TEXT    DEFAULT (date('now')),
    ultima_rev  TEXT,
    PRIMARY KEY (user_id, card_id)
  );

  CREATE TABLE IF NOT EXISTS metas (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  INTEGER NOT NULL REFERENCES users(id),
    tipo     TEXT NOT NULL,
    valor    INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, tipo)
  );

  CREATE TABLE IF NOT EXISTS sessoes_pomodoro (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    duracao_min INTEGER NOT NULL,
    tipo        TEXT DEFAULT 'foco',
    nota        TEXT,
    iniciado_em TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS streak (
    user_id     INTEGER NOT NULL REFERENCES users(id) PRIMARY KEY,
    atual       INTEGER DEFAULT 0,
    maximo      INTEGER DEFAULT 0,
    ultima_data TEXT
  );

  CREATE TABLE IF NOT EXISTS questoes (
    id           TEXT PRIMARY KEY,
    banca        TEXT,
    ano          INTEGER,
    disciplina   TEXT,
    subtopico    TEXT,
    dificuldade  TEXT DEFAULT 'medio',
    enunciado    TEXT NOT NULL,
    alternativas TEXT NOT NULL,
    gabarito     TEXT NOT NULL,
    explicacao   TEXT,
    importado_em TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessoes (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id                INTEGER NOT NULL REFERENCES users(id),
    status                 TEXT NOT NULL DEFAULT 'aberta',
    filtros_json           TEXT NOT NULL,
    question_ids_json      TEXT NOT NULL,
    quantidade_solicitada  INTEGER,
    quantidade_encontrada  INTEGER,
    criada_em              TEXT DEFAULT (datetime('now')),
    finalizada_em          TEXT
  );

  CREATE TABLE IF NOT EXISTS tentativas (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id),
    session_id    INTEGER REFERENCES sessoes(id),
    question_id   TEXT NOT NULL,
    chosen        TEXT NOT NULL,
    correct       INTEGER,
    confidence    TEXT,
    time_spent_s  INTEGER,
    respondida_em TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_tentativas_session ON tentativas(session_id);
  CREATE INDEX IF NOT EXISTS idx_tentativas_user ON tentativas(user_id);

  CREATE TABLE IF NOT EXISTS agenda_eventos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL REFERENCES users(id),
    curso_id  INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
    nome      TEXT NOT NULL,
    data      TEXT NOT NULL,
    status    TEXT DEFAULT 'confirmada',
    peso      REAL DEFAULT 1,
    criado_em TEXT DEFAULT (datetime('now'))
  );
`);

// Migrations
try { db.prepare('ALTER TABLE cursos ADD COLUMN capa_base64 TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE questoes ADD COLUMN aula_id INTEGER REFERENCES aulas(id)').run(); } catch {}
try { db.prepare('ALTER TABLE questoes ADD COLUMN origem TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE progress ADD COLUMN confidence TEXT').run(); } catch {}
try { db.prepare("ALTER TABLE sessoes ADD COLUMN modo TEXT NOT NULL DEFAULT 'treinamento'").run(); } catch {}
try { db.prepare('ALTER TABLE cursos ADD COLUMN concurso_id INTEGER REFERENCES concursos(id)').run(); } catch {}

// Seed concursos se vazio
const { c: concursosCount } = db.prepare('SELECT COUNT(*) AS c FROM concursos').get();
if (concursosCount === 0) {
  db.prepare("INSERT INTO concursos (nome, data_prova, cor) VALUES (?, ?, ?)").run('CGU', '2026-12-13', '#b9ff66');
  db.prepare("INSERT INTO concursos (nome, data_prova, cor) VALUES (?, ?, ?)").run('SETEC', '2027-01-17', '#facc15');
}

export function updateStreak(userId) {
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const row = db.prepare('SELECT * FROM streak WHERE user_id = ?').get(userId);
  if (!row) {
    db.prepare('INSERT INTO streak (user_id, atual, maximo, ultima_data) VALUES (?,1,1,?)').run(userId, today);
    return;
  }
  if (row.ultima_data === today) return;

  const novoAtual = row.ultima_data === yesterday ? row.atual + 1 : 1;
  const novoMax   = Math.max(novoAtual, row.maximo);
  db.prepare('UPDATE streak SET atual=?, maximo=?, ultima_data=? WHERE user_id=?')
    .run(novoAtual, novoMax, today, userId);
}

export default db;
