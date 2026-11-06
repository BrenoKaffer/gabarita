import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveQuestionMeta } from '../lib/questionSource.js';

const router = Router();
router.use(requireAuth);

// GET /api/dominio — % de domínio por assunto (ou disciplina, quando não há assunto vinculado),
// a partir do estado mais recente de cada questão (tabela progress). Ordenado do mais fraco pro mais forte.
router.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT question_id, correct, confidence FROM progress WHERE user_id = ? AND correct IS NOT NULL'
  ).all(req.user.id);

  const buckets = new Map();
  for (const r of rows) {
    const meta = resolveQuestionMeta(r.question_id);
    const key = meta.aula_id ? `aula:${meta.aula_id}` : (meta.disc || 'Outros');
    if (!buckets.has(key)) {
      buckets.set(key, {
        chave: meta.assunto || meta.disc || 'Outros',
        tipo: meta.aula_id ? 'assunto' : 'disciplina',
        aula_id: meta.aula_id || null,
        total: 0,
        acertos: 0,
        pendentes: 0,
      });
    }
    const b = buckets.get(key);
    b.total++;
    if (r.correct === 1) b.acertos++;
    const fraco = r.correct === 0 || (r.correct === 1 && r.confidence === 'chutei');
    if (fraco) b.pendentes++;
  }

  const result = [...buckets.values()]
    .filter(b => b.total >= 2)
    .map(b => ({ ...b, pct: Math.round((b.acertos / b.total) * 100) }))
    .sort((a, b) => a.pct - b.pct);

  res.json(result);
});

export default router;
