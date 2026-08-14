# Skinova

Skinova is a consumer skincare intelligence app for the **YouCam API Skin AI & Apparel VTO Hackathon**.

Selected hackathon track: **FIRST TRACK - Skin AI**.

Skinova converts a selfie scan into skin insights, routine guidance, progress tracking, and a realistic improvement story. It is positioned as skincare education and consumer guidance, not medical diagnosis.

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

1. Open http://localhost:3000 (public landing page)
2. Click **Get Started**
3. Sign up with name, email, and password (8+ characters)
4. You are redirected to **/dashboard**
5. Open **Skin Scan**, upload a clear front-facing selfie
6. Review **Results**, **Routine**, **Coach**, **Progress**, and **Health**
7. Use **Log out** from the sidebar to return to the public site

Unauthenticated access to `/scan`, `/results`, `/coach`, `/progress`, `/health`, or `/settings` redirects to `/login`.

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

1. Landing page explains Skinova at `/`
2. Sign up or log in

### Authenticated app

1. Dashboard at `/dashboard`
2. Skin Scan uploads a clear selfie for analysis
3. Results converts skin scores into plain-language education
4. Routine generates morning and night guidance
5. Skin Coach answers bounded skincare questions
6. Progress shows trend history and improvement simulation story
7. Health shows app readiness (demo vs live mode)

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

Then run:

```bash
npm run youcam:smoke:full
```

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

## Demo script

See [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## Submission package

See [docs/SUBMISSION_PACKAGE.md](docs/SUBMISSION_PACKAGE.md) and [docs/COMPLIANCE_REVIEW.md](docs/COMPLIANCE_REVIEW.md).

## Known limitations

- Scan history is session-based in the browser, not yet stored per user in Neon
- Privacy and Terms pages are placeholders
- No email verification or password reset yet
- Full live scan testing requires valid YouCam units and a front-facing selfie (face should fill most of the frame)

## License

MIT, unless replaced by a different project license before submission.
