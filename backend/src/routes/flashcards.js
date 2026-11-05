import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// ── SM-2 Algorithm ──
// rating: 1 (não sabia) | 3 (hesitei) | 5 (sabia)
function sm2(state, rating) {
  let { intervalo, easiness, repeticoes } = state;

  if (rating < 3) {
    intervalo = 1;
    repeticoes = 0;
  } else {
    if (repeticoes === 0) intervalo = 1;
    else if (repeticoes === 1) intervalo = 6;
    else intervalo = Math.round(intervalo * easiness);
    repeticoes += 1;
  }

  easiness = Math.max(1.3, easiness + 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));

  const d = new Date();
  d.setDate(d.getDate() + intervalo);
  const proxima_rev = d.toISOString().slice(0, 10);
  const ultima_rev  = new Date().toISOString().slice(0, 10);

  return { intervalo, easiness, repeticoes, proxima_rev, ultima_rev };
}

function memoryStrength(srs) {
  if (!srs || srs.repeticoes === 0) return 0;
  const days = srs.intervalo;
  if (days <= 1)  return 10;
  if (days <= 3)  return 25;
  if (days <= 7)  return 50;
  if (days <= 14) return 75;
  return 100;
}

// ── Helpers ──
function getOrCreateAutoDeck(userId) {
  let deck = db.prepare("SELECT * FROM decks WHERE user_id = ? AND auto_deck = 1 LIMIT 1").get(userId);
  if (!deck) {
    const r = db.prepare("INSERT INTO decks (user_id, titulo, descricao, cor, auto_deck) VALUES (?, ?, ?, ?, 1)")
      .run(userId, 'Erros Automáticos', 'Questões erradas convertidas em flashcards', '#ef4444');
    deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(r.lastInsertRowid);
  }
  return deck;
}

function ensureSrsState(userId, cardId) {
  db.prepare(`
    INSERT OR IGNORE INTO srs_state (user_id, card_id) VALUES (?, ?)
  `).run(userId, cardId);
  return db.prepare('SELECT * FROM srs_state WHERE user_id = ? AND card_id = ?').get(userId, cardId);
}

// ── Decks ──
router.get('/decks', (req, res) => {
  const uid = req.user.id;
  const today = new Date().toISOString().slice(0, 10);
  const decks = db.prepare('SELECT * FROM decks WHERE user_id = ? ORDER BY auto_deck ASC, criado_em DESC').all(uid);

  const result = decks.map(d => {
    const total = db.prepare('SELECT COUNT(*) AS c FROM flashcards WHERE deck_id = ?').get(d.id).c;
    const due   = db.prepare(`
      SELECT COUNT(*) AS c FROM flashcards f
      LEFT JOIN srs_state s ON s.card_id = f.id AND s.user_id = ?
      WHERE f.deck_id = ? AND (s.proxima_rev IS NULL OR s.proxima_rev <= ?)
    `).get(uid, d.id, today).c;
    const avgStrength = (() => {
      if (total === 0) return 0;
      const states = db.prepare(`
        SELECT s.intervalo, s.repeticoes FROM flashcards f
        LEFT JOIN srs_state s ON s.card_id = f.id AND s.user_id = ?
        WHERE f.deck_id = ?
      `).all(uid, d.id);
      const sum = states.reduce((acc, s) => acc + memoryStrength(s), 0);
      return Math.round(sum / states.length);
    })();
    return { ...d, total, due, avg_strength: avgStrength };
  });

  res.json(result);
});

router.post('/decks', (req, res) => {
  const { titulo, descricao = '', cor = '#6366f1' } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ error: 'titulo obrigatório' });
  const r = db.prepare('INSERT INTO decks (user_id, titulo, descricao, cor) VALUES (?, ?, ?, ?)')
    .run(req.user.id, titulo.trim(), descricao, cor);
  res.json({ id: r.lastInsertRowid });
});

router.put('/decks/:id', (req, res) => {
  const { titulo, descricao, cor } = req.body;
  db.prepare('UPDATE decks SET titulo=?, descricao=?, cor=? WHERE id=? AND user_id=?')
    .run(titulo, descricao, cor, req.params.id, req.user.id);
  res.json({ ok: true });
});

router.delete('/decks/:id', (req, res) => {
  db.prepare('DELETE FROM decks WHERE id=? AND user_id=?').run(req.params.id, req.user.id);
  res.json({ ok: true });
});

// ── Cards ──
router.get('/decks/:id/cards', (req, res) => {
  const uid = req.user.id;
  const deckId = req.params.id;
  const deck = db.prepare('SELECT * FROM decks WHERE id=? AND user_id=?').get(deckId, uid);
  if (!deck) return res.status(404).json({ error: 'deck não encontrado' });

  const today = new Date().toISOString().slice(0, 10);
  const cards = db.prepare(`
    SELECT f.*, s.intervalo, s.easiness, s.repeticoes, s.proxima_rev, s.ultima_rev
    FROM flashcards f
    LEFT JOIN srs_state s ON s.card_id = f.id AND s.user_id = ?
    WHERE f.deck_id = ?
    ORDER BY f.criado_em ASC
  `).all(uid, deckId);

  res.json({
    deck,
    cards: cards.map(c => ({
      ...c,
      due: !c.proxima_rev || c.proxima_rev <= today,
      strength: memoryStrength(c),
    })),
  });
});

router.post('/decks/:id/cards', (req, res) => {
  const { frente, verso, source = 'manual', source_id = null } = req.body;
  if (!frente?.trim() || !verso?.trim())
    return res.status(400).json({ error: 'frente e verso obrigatórios' });

  const deck = db.prepare('SELECT * FROM decks WHERE id=? AND user_id=?').get(req.params.id, req.user.id);
  if (!deck) return res.status(404).json({ error: 'deck não encontrado' });

  const r = db.prepare('INSERT INTO flashcards (deck_id, frente, verso, source, source_id) VALUES (?,?,?,?,?)')
    .run(deck.id, frente.trim(), verso.trim(), source, source_id);
  res.json({ id: r.lastInsertRowid });
});

router.put('/cards/:id', (req, res) => {
  const { frente, verso } = req.body;
  // Verify ownership via deck
  const card = db.prepare(`
    SELECT f.* FROM flashcards f JOIN decks d ON d.id = f.deck_id
    WHERE f.id=? AND d.user_id=?
  `).get(req.params.id, req.user.id);
  if (!card) return res.status(404).json({ error: 'cartão não encontrado' });
  db.prepare('UPDATE flashcards SET frente=?, verso=? WHERE id=?').run(frente, verso, req.params.id);
  res.json({ ok: true });
});

router.delete('/cards/:id', (req, res) => {
  const card = db.prepare(`
    SELECT f.* FROM flashcards f JOIN decks d ON d.id = f.deck_id
    WHERE f.id=? AND d.user_id=?
  `).get(req.params.id, req.user.id);
  if (!card) return res.status(404).json({ error: 'cartão não encontrado' });
  db.prepare('DELETE FROM flashcards WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── Session ──
// GET /sessao?deck=X  — returns today's due cards (optionally filtered by deck)
router.get('/sessao', (req, res) => {
  const uid = req.user.id;
  const today = new Date().toISOString().slice(0, 10);
  const deckFilter = req.query.deck;

  let query = `
    SELECT f.*, d.titulo AS deck_titulo, d.cor AS deck_cor,
      s.intervalo, s.easiness, s.repeticoes, s.proxima_rev
    FROM flashcards f
    JOIN decks d ON d.id = f.deck_id
    LEFT JOIN srs_state s ON s.card_id = f.id AND s.user_id = ?
    WHERE d.user_id = ?
    AND (s.proxima_rev IS NULL OR s.proxima_rev <= ?)
  `;
  const params = [uid, uid, today];

  if (deckFilter) {
    query += ' AND d.id = ?';
    params.push(deckFilter);
  }

  query += ' ORDER BY COALESCE(s.proxima_rev, \'0000-00-00\') ASC, f.id ASC';

  const cards = db.prepare(query).all(...params);
  res.json(cards);
});

// POST /cards/:id/avaliar  — submit SM-2 rating
router.post('/cards/:id/avaliar', (req, res) => {
  const { rating } = req.body; // 1 | 3 | 5
  if (![1, 3, 5].includes(rating))
    return res.status(400).json({ error: 'rating deve ser 1, 3 ou 5' });

  const uid = req.user.id;
  const cardId = req.params.id;

  // Verify ownership
  const card = db.prepare(`
    SELECT f.* FROM flashcards f JOIN decks d ON d.id = f.deck_id
    WHERE f.id=? AND d.user_id=?
  `).get(cardId, uid);
  if (!card) return res.status(404).json({ error: 'cartão não encontrado' });

  const state = ensureSrsState(uid, cardId);
  const next  = sm2(state, rating);

  db.prepare(`
    UPDATE srs_state SET intervalo=?, easiness=?, repeticoes=?, proxima_rev=?, ultima_rev=?
    WHERE user_id=? AND card_id=?
  `).run(next.intervalo, next.easiness, next.repeticoes, next.proxima_rev, next.ultima_rev, uid, cardId);

  res.json({ ...next, strength: memoryStrength(next) });
});

// POST /auto  — create flashcard from wrong question answer
router.post('/auto', (req, res) => {
  const { frente, verso, source_id } = req.body;
  if (!frente?.trim() || !verso?.trim())
    return res.status(400).json({ error: 'frente e verso obrigatórios' });

  const uid = req.user.id;

  // Check if card for this question already exists
  if (source_id) {
    const existing = db.prepare(`
      SELECT f.id FROM flashcards f JOIN decks d ON d.id = f.deck_id
      WHERE d.user_id = ? AND f.source_id = ?
    `).get(uid, source_id);
    if (existing) return res.json({ id: existing.id, exists: true });
  }

  const deck = getOrCreateAutoDeck(uid);
  const r = db.prepare('INSERT INTO flashcards (deck_id, frente, verso, source, source_id) VALUES (?,?,?,?,?)')
    .run(deck.id, frente.trim(), verso.trim(), 'question', source_id || null);

  res.json({ id: r.lastInsertRowid, deck_id: deck.id, exists: false });
});

// POST /decks/:id/import  — import deck from JSON {cards: [{frente, verso}]}
router.post('/decks/:id/import', (req, res) => {
  const { cards } = req.body;
  if (!Array.isArray(cards) || cards.length === 0)
    return res.status(400).json({ error: 'cards deve ser um array não vazio' });

  const deck = db.prepare('SELECT * FROM decks WHERE id=? AND user_id=?').get(req.params.id, req.user.id);
  if (!deck) return res.status(404).json({ error: 'deck não encontrado' });

  const insert = db.prepare('INSERT INTO flashcards (deck_id, frente, verso, source) VALUES (?,?,?,?)');
  const tx = db.transaction((cs) => {
    let count = 0;
    for (const c of cs) {
      if (c.frente?.trim() && c.verso?.trim()) {
        insert.run(deck.id, c.frente.trim(), c.verso.trim(), 'import');
        count++;
      }
    }
    return count;
  });

  const imported = tx(cards);
  res.json({ imported });
});

export default router;
