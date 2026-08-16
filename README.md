# Skinova

![Skinova project cover](./public/screenshots/project-cover.png)

**Live demo:** https://skinova-ai.vercel.app

Skinova is a consumer skincare intelligence app for the **YouCam API Skin AI & Apparel VTO Hackathon**.

Selected hackathon track: **Skin AI**.

Skinova converts a selfie scan into skin insights, routine guidance, progress tracking, and a realistic improvement story. It is positioned as skincare education and consumer guidance, not medical diagnosis.

## Documentation

Full project documentation lives in [docs/README.md](docs/README.md), including architecture, roadmap, API integration, submission package, and testing.

**System architecture diagram:** [docs/architecture.html](docs/architecture.html) — interactive layer view (frontend, API, YouCam, Qwen, Neon) matching the Memoria submission style. Open locally in a browser or view on GitHub.

## Quick Start (one command)

From a fresh machine with Node.js 20+ and git installed:

```bash
git clone https://github.com/imawais-engineer/Skinova.git && cd Skinova && npm run setup
```

What `npm run setup` does:

1. Creates `.env` from `.env.example` if missing
2. Generates `AUTH_SECRET` with `openssl rand -base64 32`
3. Runs `npm install`
4. Runs `npm run db:init` when `DATABASE_URL` is set
5. Starts the app at http://localhost:3000

### Deploy on Vercel (recommended for public demo)

Skinova uses **Neon Postgres** (free tier) for user accounts. See [docs/VERCEL_NEON_DEPLOY.md](docs/VERCEL_NEON_DEPLOY.md).

Production deployment: https://skinova-ai.vercel.app

### Already have the repo?

```bash
cd Skinova && npm run setup
```

### Manual setup (if you prefer)

```bash
git pull origin main
cp .env.example .env
export AUTH_SECRET="$(openssl rand -base64 32)"
perl -0pi -e "s/^AUTH_SECRET=.*/AUTH_SECRET=$ENV{AUTH_SECRET}/m" .env
# Add DATABASE_URL from https://neon.tech
npm install
npm run db:init
npm run dev
```

Open http://localhost:3000.

## Judge testing flow

### Option A — production (fastest)

1. Open https://skinova-ai.vercel.app
2. Click **Get Started** and create an account
3. Open **Skin Scan** — upload a selfie or pick a bundled YouCam playground sample
4. Watch the live scan stepper, then review **Results**, **Routine**, **Coach**, and **Progress**
5. On the landing page (after log out), note **Live status** (5 YouCam APIs + Neon ready)

## Record your demo video

The app is **demo-ready** on production. No voiceover needed — screen-record while clicking through.

```bash
npm run verify:demo    # pre-flight: all 9 steps must pass
```

Then follow **[docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)** (~2–3 min silent recording). Upload to YouTube/Vimeo/Youku and add the URL to [docs/SUBMISSION_PACKAGE.md](docs/SUBMISSION_PACKAGE.md).

### Option B — local

1. Open http://localhost:3000
2. Click **Get Started**
3. Sign up with name, email, and password (8+ characters)
4. You are redirected to **/dashboard**
5. Open **Skin Scan**, upload a clear front-facing selfie or use a demo sample
6. Review **Results**, **Routine**, **Coach**, and **Progress**
7. Use **Log out** from the sidebar to return to the public site

Unauthenticated access to `/scan`, `/results`, `/coach`, `/progress`, or `/settings` redirects to `/login`.

## Environment

Required variables in `.env`:

```env
API_KEY=YOUCAM_API_KEY
SECRET_KEY=YOUCAM_SECRET_KEY
BASE_URL=https://yce-api-01.makeupar.com
SKINOVA_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=your_generated_secret
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
```

| Variable | Purpose |
|----------|---------|
| `API_KEY` | YouCam API key (server-side only) |
| `AUTH_SECRET` | Signs auth session cookies — generate with `openssl rand -base64 32` |
| `DATABASE_URL` | Neon Postgres connection string ([free tier](https://neon.tech)) |
| `SKINOVA_DEMO_MODE` | Set `true` to run scans without YouCam credentials |

Use live YouCam mode only in environments intended to create real scan tasks.

## Product flow

### Public

1. Landing page explains Skinova at `/` and shows **Live status** via `/api/skinova/health`
2. Sign up or log in
3. Privacy and Terms at `/privacy` and `/terms`

### Authenticated app

1. Dashboard at `/dashboard`
2. Skin Scan — upload or pick a sample, then run the six-step live scan flow
3. Results — plain-language education from YouCam `ui_score` output
4. Routine — morning and night guidance
5. Skin Coach — bounded skincare Q&A (optional Qwen LLM + knowledge RAG)
6. Progress — scan history, trend deltas, and before/after Skin Simulation
7. Settings — clear scan session and coach history

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Neon Postgres + bcrypt + JWT session cookies (auth)
- Lucide icons
- Server-side YouCam API routes

## Verification

```bash
npm run typecheck
npm run build
npm run verify:ui
npm run youcam:smoke
```

`npm run youcam:smoke` validates the YouCam Skin Analysis metadata request using `.env`.

`npm run verify:ui` expects the app at `http://localhost:3000`. It checks `/`, `/login`, and `/signup` for horizontal overflow.

For a full upload/task/poll smoke test, add a valid front-facing selfie:

```text
Testing/INPUT/selfie.jpg
```

Or use bundled samples:

```bash
YOUCAM_TEST_IMAGE_PATH=public/samples/youcam-clear-baseline.jpg npm run youcam:smoke:full
```

See [docs/TESTING.md](docs/TESTING.md) for the full QA checklist.

Do not commit private selfies or `.env`.

## YouCam API workflow

Product-level routes:

- `POST /api/skinova/scan`
- `GET /api/skinova/scan-status/[taskId]`

Auth routes:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Integration details: [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md)

## Demo script and submission

- Demo video script: [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)
- Devpost copy and checklist: [docs/SUBMISSION_PACKAGE.md](docs/SUBMISSION_PACKAGE.md)
- Compliance matrix: [docs/COMPLIANCE_REVIEW.md](docs/COMPLIANCE_REVIEW.md)
- **Progress metrics & scorecard:** [docs/PROGRESS_METRICS.md](docs/PROGRESS_METRICS.md)

## Known limitations

- Scan history is stored per user in Neon (`user_scans`) and hydrated into the session when you return
- Routine plans persist per user in Neon (`user_routine_plans`) across devices and reloads
- Progress includes live YouCam Skin Simulation before/after comparison when a scan file ID is available
- Product API routes are rate-limited per user (scan, simulation, coach, routine)
- No email verification or password reset yet
- Full live scan testing requires valid YouCam units and a front-facing selfie (face should fill most of the frame)
- Demo video for Devpost: record before submission deadline (script ready; URL to be added when published)

## License

MIT — see [LICENSE](LICENSE).

YouCam API and Perfect Corp. marks belong to their respective owners.
