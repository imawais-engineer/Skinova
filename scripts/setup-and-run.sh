#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

if grep -q '^AUTH_SECRET=generate_with_openssl_rand_base64_32' .env || ! grep -q '^AUTH_SECRET=.' .env; then
  AUTH_SECRET="$(openssl rand -base64 32)"
  if grep -q '^AUTH_SECRET=' .env; then
    sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=${AUTH_SECRET}|" .env
  else
    echo "AUTH_SECRET=${AUTH_SECRET}" >> .env
  fi
  echo "Generated AUTH_SECRET in .env"
fi

if ! grep -q '^DATABASE_PATH=' .env; then
  echo "DATABASE_PATH=./data/skinova.db" >> .env
fi

mkdir -p data

echo "Installing dependencies..."
npm install

echo ""
echo "Starting Skinova at http://localhost:3000"
echo "Judge flow: open / -> Get Started -> sign up -> /dashboard -> Skin Scan"
echo ""

npm run dev
