# Deploy Skinova on Vercel with Neon (free)

Skinova’s frontend, API routes, and YouCam proxy run on Vercel. User accounts are stored in **Neon Postgres** (free tier, serverless-friendly).

Production example: **https://skinova-ai.vercel.app**

## 1. Create a Neon database (free)

1. Go to [https://neon.tech](https://neon.tech) and create an account.
2. Create a new project (e.g. `skinova`).
3. Copy the **connection string** (starts with `postgresql://`).
4. Use the pooled connection string if Neon offers one — either works for this app.

## 2. Initialize the database schema

Locally, add to `.env`:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
```

Then run:

```bash
npm run db:init
```

You should see:

```json
{ "ok": true, "message": "Neon database schema is ready." }
```

## 3. Deploy to Vercel

1. Push the repo to GitHub.
2. Go to [https://vercel.com](https://vercel.com) → **Add New Project** → import `Skinova`.
3. Add environment variables:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `API_KEY` | Your YouCam API key |
| `SECRET_KEY` | Your YouCam secret (if required by your plan) |
| `BASE_URL` | `https://yce-api-01.makeupar.com` |
| `SKINOVA_DEMO_MODE` | `false` (or `true` for demo-only) |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |
| `QWEN_API_KEY` | DashScope API key (optional, for live coach LLM) |
| `QWEN_BASE_URL` | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| `COACH_LLM_MODEL` | `qwen3-max` (or `deepseek-v4-flash`) |
| `EMBEDDING_MODEL` | `text-embedding-v4` |
| `EMBEDDING_DIMENSIONS` | `1536` |

4. Deploy.

After deploy, ingest the skincare knowledge base (one-time per environment):

```bash
npm run knowledge:ingest
```

Vercel runs `npm run build` automatically. Auth and YouCam routes run as serverless functions.

## 4. Verify production

1. Open your Vercel URL (e.g. https://skinova-ai.vercel.app).
2. **Get Started** → sign up.
3. **Skin Scan** — use a bundled sample or upload a selfie.
4. Log out and confirm **Live status** on the landing page (demo vs live scan mode).

## Architecture on Vercel

```text
Browser
   ↓
Vercel (Next.js)
   ├── Static/SSR pages (landing, login, app)
   ├── /api/auth/*        → Neon Postgres
   └── /api/skinova/*     → YouCam API (server-side)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full system diagram.

## Why Neon?

- **Free tier** suitable for hackathon/demo traffic
- **Serverless** — works with Vercel functions (no local SQLite file)
- **Simple integration** — one `DATABASE_URL`, minimal schema
- **Vercel-friendly** — common pairing in production Next.js apps

## Local development

```bash
git clone https://github.com/imawais-engineer/Skinova.git
cd Skinova
cp .env.example .env
# Add DATABASE_URL, AUTH_SECRET, API_KEY
npm install
npm run db:init
npm run dev
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Sign up fails | Check `DATABASE_URL` and run `npm run db:init` |
| Auth works locally but not on Vercel | Add all env vars in Vercel project settings |
| Scans fail | Set `API_KEY` and `SKINOVA_DEMO_MODE=false`, or use demo mode |
| Session lost | Ensure `AUTH_SECRET` is set and identical across redeploys |
| Coach returns fallback only | Set `QWEN_API_KEY` and run `npm run knowledge:ingest` |
