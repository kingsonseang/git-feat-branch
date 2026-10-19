#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node 20.11 or newer." >&2
  exit 1
fi

node -e '
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && minor < 11)) {
  console.error(`Node 20.11 or newer is required; found ${process.versions.node}.`);
  process.exit(1);
}
'

if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

echo "Taskline dependencies are installed."
