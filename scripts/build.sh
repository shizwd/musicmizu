#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v faircamp >/dev/null 2>&1; then
  echo "Faircamp is required. Install Faircamp 1.7+ from https://faircamp.org/" >&2
  exit 1
fi

faircamp \
  --catalog-dir "$PROJECT_ROOT/catalog" \
  --build-dir "$PROJECT_ROOT/dist"

echo "Built site at $PROJECT_ROOT/dist"

