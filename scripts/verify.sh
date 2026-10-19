#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Checking for unresolved conflict markers"
if git grep -nE '^(<<<<<<< |=======$|>>>>>>> )' -- ':!package-lock.json'; then
  echo "Unresolved conflict markers were found." >&2
  exit 1
fi

echo "==> TypeScript"
npm run typecheck

echo "==> Tests"
npm test

echo "==> Production build"
npm run build

echo "All verification checks passed."
