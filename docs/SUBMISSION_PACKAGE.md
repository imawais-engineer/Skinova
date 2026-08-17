# Submission Package

Production app: **https://skinova-ai.vercel.app**

Repository: **https://github.com/imawais-engineer/Skinova**

## Devpost Description

Skinova is a Skin AI consumer skincare intelligence experience built on the YouCam Skin Analysis API. It helps users move from a selfie scan to plain-language skin insights, a personalized routine, progress tracking, and an improvement simulation story.

The product is designed for people who can see changes in their skin but do not know what those changes mean or what to do next. Skinova avoids medical diagnosis and focuses on skincare education, personalization, and consumer guidance.

**YouCam APIs (5):** AI Skin Analysis, Fitzpatrick Scale Analyzer, Skin Tone Analysis, Face Analyzer, and AI Skin Simulation — file metadata, presigned upload, task creation, polling, and consumer-facing normalization.

**Track:** Skin AI (YouCam API Skin AI & Apparel VTO Hackathon).

## Repository URL

```text
https://github.com/imawais-engineer/Skinova
```

## Demo Video

**Published:** https://youtu.be/3twwbGyQqWA

| Item | Status |
| --- | --- |
| Screen-record guide | [DEMO_SCRIPT.md](DEMO_SCRIPT.md) (silent, no voiceover) |
| Pre-flight check | `npm run verify:demo` (all steps against production) |
| Recording | ✅ Published on YouTube |
| Public URL | https://youtu.be/3twwbGyQqWA |

### YouTube title (paste on YouTube / Devpost)

```text
Skinova — YouCam Skin AI Companion | Scan → Routine → Progress Demo
```

### YouTube description (paste on YouTube / Devpost)

```text
Skinova is a consumer skincare intelligence app built for the YouCam API Skin AI & Apparel VTO Hackathon (Track: Skin AI).

Try it live: https://skinova-ai.vercel.app
Source code: https://github.com/imawais-engineer/Skinova

This silent screen demo walks through the full product flow:
• Landing page with live YouCam API + Neon status
• Sign up and dashboard
• Skin Scan — six-step live analysis with YouCam playground samples
• Results — concern scores, Fitzpatrick + skin tone + face attributes, concern detection masks
• AI Routine — personalized morning/night skincare cards
• Skin Coach — grounded Q&A from scan context
• Progress — trend tracking and YouCam Skin Simulation before/after preview

YouCam APIs integrated (5):
1. AI Skin Analysis
2. Fitzpatrick Scale Analyzer
3. Skin Tone Analysis
4. Face Analyzer
5. AI Skin Simulation

Skinova is for skincare education and consumer guidance only — not medical diagnosis.

Built with Next.js 15, Neon Postgres, and optional Qwen LLM for Skin Coach.
MIT License.
```

```text
DEMO_VIDEO_URL=https://youtu.be/3twwbGyQqWA
```

## Screenshots

All captures are in `public/screenshots/` (see [SCREENSHOTS.md](SCREENSHOTS.md) and [public/screenshots/README.md](../public/screenshots/README.md)).

| File | Screen |
| --- | --- |
| `project-cover.png` | Landing hero |
| `landing-live-status.png` | Live status section |
| `signup.png` | Sign up |
| `dashboard.png` | Dashboard |
| `scan-complete.png` | Completed scan |
| `results.png` | Results |
| `routine.png` | Routine |
| `coach.png` | Skin Coach (answered question) |
| `progress.png` | Progress |

## Judge Testing Instructions

### Fastest path — production

1. Open https://skinova-ai.vercel.app
2. **Get Started** → create an account
3. **Skin Scan** → upload a selfie or choose **Try one of these** (YouCam playground samples)
4. Review **Results**, **Routine**, **Coach**, **Progress** (run Skin Simulation on Progress)
5. Log out and confirm **Live status** on the landing page

### Local one-command setup

Requires Node.js 20+ and git.

```bash
git clone https://github.com/imawais-engineer/Skinova.git && cd Skinova && npm run setup
```

This command:

1. Clones the repository
2. Creates `.env` from `.env.example`
3. Generates `AUTH_SECRET` automatically
4. Sets `DATABASE_URL` and runs `npm run db:init` when configured
5. Installs dependencies
6. Starts the dev server at http://localhost:3000

### Configure Neon (required for sign up)

1. Create a free database at https://neon.tech
2. Add `DATABASE_URL` to `.env`
3. Run `npm run db:init`

### Deploy on Vercel

See [VERCEL_NEON_DEPLOY.md](VERCEL_NEON_DEPLOY.md).

### Configure YouCam (optional, for live scans)

Edit `.env` before or after first run:

```env
API_KEY=your_youcam_api_key
SKINOVA_DEMO_MODE=false
```

Demo mode works without YouCam credentials (`SKINOVA_DEMO_MODE=true`).

### Optional API smoke test

```bash
npm run youcam:smoke
```

Full upload/task/poll test (requires valid selfie at `Testing/INPUT/selfie.jpg` or a bundled sample):

```bash
YOUCAM_TEST_IMAGE_PATH=public/samples/youcam-clear-baseline.jpg npm run youcam:smoke:full
```

## Known Limitations

- Product recommendations and affiliate commerce are intentionally deferred
- Full live task testing requires valid YouCam units and a valid front-facing selfie
- Skin Simulation preview URLs expire after a few hours per YouCam policy

## License And Attribution

- Application source code: [MIT](../LICENSE)
- YouCam API and Perfect Corp. marks belong to their owners
- Do not include copyrighted music or third-party trademarked assets in the demo video unless permission is available
- Sample faces in `public/samples/` are from the YouCam API Playground CDN for demo and smoke testing
