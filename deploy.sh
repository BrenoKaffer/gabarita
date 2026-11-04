#!/usr/bin/env bash
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

MSG="${1:-update}"

echo "==> Build..."
cd frontend && npm run build && cd ..

echo "==> Commit..."
git add -A
git diff --cached --quiet && { echo "Nada para commitar."; exit 0; }
git commit -m "$MSG"

echo "==> Push..."
git push

echo ""
echo "Deploy iniciado! Acompanhe em:"
echo "https://github.com/BrenoKaffer/gabarita/actions"
