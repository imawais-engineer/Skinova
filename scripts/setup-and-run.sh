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

echo "Installing dependencies..."
npm install

if grep -q '^DATABASE_URL=postgresql' .env; then
  echo "Initializing Neon database schema..."
  npm run db:init
else
  echo ""
  echo "Add your Neon DATABASE_URL to .env before signing up."
  echo "See docs/VERCEL_NEON_DEPLOY.md"
  echo ""
fi

echo ""
echo "Starting Skinova at http://localhost:3000"
echo "Judge flow: open / -> Get Started -> sign up -> /dashboard -> Skin Scan"
echo ""

npm run dev
