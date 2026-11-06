import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from '../db/index.js';
import { toQFormat } from '../routes/questoes.js';

// ── Banco estático (questions.json), carregado uma vez em memória ──
const __dir = dirname(fileURLToPath(import.meta.url));
const STATIC_QUESTIONS_PATH = join(__dir, '..', '..', '..', 'frontend', 'dist', 'questions.json');

let staticList = [];
let staticById = new Map();
try {
  staticList = JSON.parse(readFileSync(STATIC_QUESTIONS_PATH, 'utf-8'));
  staticById = new Map(staticList.map(q => [q.id, q]));
} catch {
  // frontend/dist ainda não foi buildado — segue só com o banco do DB
}

export function getStaticList() {
  return staticList;
}

// Resolve disciplina + assunto (aula) + aula_id de uma questão, DB ou estática.
// Questões estáticas nunca têm aula_id (sem vínculo com cursos), só disciplina.
export function resolveQuestionMeta(qid) {
  const row = db.prepare(`
    SELECT q.disciplina AS disc, a.titulo AS assunto, a.id AS aula_id
    FROM questoes q
    LEFT JOIN aulas a ON a.id = q.aula_id
    WHERE q.id = ?
  `).get(qid);
  if (row) return { disc: row.disc || null, assunto: row.assunto || null, aula_id: row.aula_id || null };
  const s = staticById.get(qid);
  return { disc: s?.disc || null, assunto: null, aula_id: null };
}

export function resolveQuestionObj(qid) {
  const row = db.prepare('SELECT * FROM questoes WHERE id = ?').get(qid);
  if (row) return toQFormat(row);
  return staticById.get(qid) || null;
}
