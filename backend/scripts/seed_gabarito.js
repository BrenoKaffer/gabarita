// Roda uma vez para popular a tabela gabarito no SQLite
// uso: node backend/scripts/seed_gabarito.js
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from '../src/db/index.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dir, '..', 'seed_gabarito.json'), 'utf8'));

const stmt = db.prepare(`
  INSERT INTO gabarito (question_id, correct, disc, source)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(question_id) DO UPDATE SET correct=excluded.correct, disc=excluded.disc
`);

let count = 0;
for (const [qid, { correct, disc, source }] of Object.entries(data)) {
  stmt.run(qid, correct, disc, source);
  count++;
}

console.log(`Gabarito: ${count} questões inseridas/atualizadas.`);
