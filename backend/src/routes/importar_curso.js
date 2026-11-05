import { Router } from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

const SYSTEM_PROMPT = `Você é um especialista em estruturação de programas acadêmicos e currículos de cursos universitários.
Dado o texto de um programa de disciplina (plano de ensino), extraia a estrutura completa e retorne APENAS um JSON válido, sem markdown, sem explicações.

O JSON deve seguir este formato exato:
{
  "titulo": "Nome da disciplina/curso",
  "descricao": "Ementa resumida em 1-2 frases",
  "cor": "#6366f1",
  "provas": [
    {"nome": "Prova 1", "data": "YYYY-MM-DD", "status": "confirmada", "peso": 1}
  ],
  "modulos": [
    {
      "titulo": "Nome da unidade/módulo",
      "aulas": [
        {"titulo": "Tópico específico", "duracao_min": 50}
      ]
    }
  ]
}

Regras:
- Cada tópico do programa vira um módulo; cada subtópico vira uma aula
- Se um tópico não tem subtópicos, crie aulas nomeando os conceitos principais (mínimo 2 aulas por módulo)
- Datas: use YYYY-MM-DD. Se o ano não está no texto, use o ano atual (2026 ou 2027 conforme contexto)
- Se a data não está clara, omita o campo "data" e coloque status "estimada"
- Não invente conteúdo que não esteja no programa
- duracao_min: use 50 para aulas normais, 100 para tópicos extensos
- cor: escolha uma cor hex que combine com o tema da disciplina`;

async function chamarDeepSeek(textoUsuario) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: textoUsuario },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Resposta vazia da IA');
  return JSON.parse(content);
}

// ── POST /api/importar-curso/pdf ──
router.post('/pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Envie um arquivo PDF' });
  if (!DEEPSEEK_KEY) return res.status(500).json({ error: 'DEEPSEEK_API_KEY não configurada' });

  try {
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const text = result.text;
    if (!text?.trim()) return res.status(400).json({ error: 'PDF sem texto extraível (tente um PDF de texto, não escaneado)' });

    const estrutura = await chamarDeepSeek(
      `Programa de disciplina extraído de PDF:\n\n${text.slice(0, 12000)}`
    );

    res.json(estrutura);
  } catch (err) {
    console.error('Erro importar-curso/pdf:', err);
    res.status(500).json({ error: err.message || 'Erro ao processar PDF' });
  }
});

// ── POST /api/importar-curso/json ──
// Recebe JSON avulso do usuário e normaliza para a estrutura padrão via IA
router.post('/json', async (req, res) => {
  const { json } = req.body;
  if (!json) return res.status(400).json({ error: 'Campo json obrigatório' });
  if (!DEEPSEEK_KEY) return res.status(500).json({ error: 'DEEPSEEK_API_KEY não configurada' });

  try {
    const estrutura = await chamarDeepSeek(
      `Converta este JSON de conteúdo programático para a estrutura de curso solicitada:\n\n${JSON.stringify(json).slice(0, 12000)}`
    );
    res.json(estrutura);
  } catch (err) {
    console.error('Erro importar-curso/json:', err);
    res.status(500).json({ error: err.message || 'Erro ao processar JSON' });
  }
});

// ── POST /api/importar-curso/criar ──
// Cria o curso completo a partir da estrutura confirmada
router.post('/criar', (req, res) => {
  const { titulo, descricao, cor, modulos, provas } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ error: 'titulo obrigatório' });
  if (!Array.isArray(modulos)) return res.status(400).json({ error: 'modulos inválidos' });

  const criarCurso = db.transaction(() => {
    const { lastInsertRowid: cursoId } = db.prepare(
      'INSERT INTO cursos (titulo, descricao, cor, user_id) VALUES (?, ?, ?, ?)'
    ).run(titulo.trim(), descricao || null, cor || '#6366f1', req.user.id);

    for (let mi = 0; mi < modulos.length; mi++) {
      const m = modulos[mi];
      if (!m.titulo?.trim()) continue;
      const { lastInsertRowid: modId } = db.prepare(
        'INSERT INTO modulos (curso_id, titulo, ordem) VALUES (?, ?, ?)'
      ).run(cursoId, m.titulo.trim(), mi + 1);

      const aulas = Array.isArray(m.aulas) ? m.aulas : [];
      for (let ai = 0; ai < aulas.length; ai++) {
        const a = aulas[ai];
        if (!a.titulo?.trim()) continue;
        db.prepare(
          'INSERT INTO aulas (modulo_id, titulo, duracao_min, ordem) VALUES (?, ?, ?, ?)'
        ).run(modId, a.titulo.trim(), a.duracao_min || 50, ai + 1);
      }
    }

    if (Array.isArray(provas)) {
      const insProva = db.prepare(
        'INSERT INTO agenda_eventos (user_id, curso_id, nome, data, status, peso) VALUES (?,?,?,?,?,?)'
      );
      for (const p of provas) {
        if (!p.data) continue;
        insProva.run(req.user.id, cursoId, p.nome || 'Prova', p.data, p.status || 'confirmada', p.peso || 1);
      }
    }

    return cursoId;
  });

  try {
    const cursoId = criarCurso();
    res.json({ id: cursoId });
  } catch (err) {
    console.error('Erro criar curso:', err);
    res.status(500).json({ error: 'Erro ao criar curso' });
  }
});

export default router;
