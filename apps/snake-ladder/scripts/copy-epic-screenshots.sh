#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/store/screenshots"
LATEST="$(ls -td "$HOME/.maestro/tests"/* 2>/dev/null | head -1 || true)"

mkdir -p "$DEST"

shopt -s nullglob
copied=0
for source in "$ROOT" "$LATEST"; do
  [[ -n "$source" && -d "$source" ]] || continue
  for file in "$source"/epic-*.png "$source"/*epic-*.png; do
    [[ -f "$file" ]] || continue
    cp "$file" "$DEST/"
    copied=$((copied + 1))
  done
done

if [[ "$copied" -eq 0 ]]; then
  echo "No epic-*.png found. Run: pnpm maestro:screenshots"
  exit 1
fi

echo "Copied $copied screenshot(s) to $DEST"
ls -1 "$DEST"