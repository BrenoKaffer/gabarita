#!/usr/bin/env python3
"""
Compila todas as questões da pasta apostila_questoes/ em dois arquivos:
  - frontend/public/questions.json  (sem gabarito — para o cliente)
  - backend/seed_gabarito.json      (apenas questionId → gabarito — para sedar o SQLite)

Uso:
  cd /Users/brenoferreira/Desktop/Intsensivo\ CGU/gabarita
  python3 scripts/build_questions.py
"""
import json, os, re

SRC   = '/Users/brenoferreira/Desktop/Intsensivo CGU/apostila_questoes'
FRONT = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public')
BACK  = os.path.join(os.path.dirname(__file__), '..', 'backend')

BLACKLIST_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'apostila_questoes', 'blacklist.txt')

os.makedirs(FRONT, exist_ok=True)

# ── 1. Carregar todas as questões ──────────────────────────────────────────
all_qs = []
gabarito_map = {}  # questionId → {correct, disc}
seen = set()

for fname in sorted(os.listdir(SRC)):
    if not fname.endswith('.json'):
        continue
    with open(os.path.join(SRC, fname), encoding='utf-8') as f:
        qs = json.load(f)
    for q in qs:
        qid = q.get('id', '')
        if not qid or qid in seen:
            continue
        seen.add(qid)

        # Se tiver campo 'g', guardar no gabarito
        gab = q.get('g')
        if gab:
            gabarito_map[qid] = {
                'correct': gab.upper(),
                'disc': q.get('disc', ''),
                'source': 'created',
            }

        # Questão sem gabarito para o cliente
        pub = {
            'id':   qid,
            'e':    q.get('e', ''),
            'a':    q.get('a', []),
            'disc': q.get('disc', ''),
            'ano':  q.get('ano', ''),
            'banca':q.get('banca', ''),
        }
        all_qs.append(pub)

print(f'Total de questões: {len(all_qs)}')
print(f'Com gabarito (criadas): {len(gabarito_map)}')
print(f'Sem gabarito (QConcursos): {len(all_qs) - len(gabarito_map)}')

# Resumo por disciplina
disc_count = {}
for q in all_qs:
    d = q['disc']
    disc_count[d] = disc_count.get(d, 0) + 1
print('\nQuestões por disciplina:')
for d, n in sorted(disc_count.items()):
    has_gab = sum(1 for qid, v in gabarito_map.items() if v['disc'] == d)
    print(f'  {d:8s}: {n:3d}  ({has_gab} com gabarito)')

# ── 2. Salvar questions.json para o frontend ───────────────────────────────
out_path = os.path.join(FRONT, 'questions.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(all_qs, f, ensure_ascii=False, separators=(',', ':'))
print(f'\nSalvo: {out_path} ({os.path.getsize(out_path)//1024} KB)')

# ── 3. Salvar seed_gabarito.json para o backend ────────────────────────────
gab_path = os.path.join(BACK, 'seed_gabarito.json')
with open(gab_path, 'w', encoding='utf-8') as f:
    json.dump(gabarito_map, f, ensure_ascii=False, indent=2)
print(f'Salvo: {gab_path} ({len(gabarito_map)} entradas)')

print('\nPróximo passo:')
print('  cd backend && npm install && node scripts/seed_gabarito.js')
