# Submission Package

Production app: **https://skinova-ai.vercel.app**

Repository: **https://github.com/imawais-engineer/Skinova**

## Devpost Description

Skinova is a Skin AI consumer skincare intelligence experience built on the YouCam Skin Analysis API. It helps users move from a selfie scan to plain-language skin insights, a personalized routine, progress tracking, and an improvement simulation story.

The product is designed for people who can see changes in their skin but do not know what those changes mean or what to do next. Skinova avoids medical diagnosis and focuses on skincare education, personalization, and consumer guidance.

**YouCam API:** AI Skin Analysis — file metadata, presigned upload, task creation, polling, and `ui_score` normalization into consumer-facing guidance.

**Track:** Skin AI (YouCam API Skin AI & Apparel VTO Hackathon).

## Repository URL

```text
https://github.com/imawais-engineer/Skinova
```

## Demo Video

| Item | Status |
| --- | --- |
| Script | Ready — [DEMO_SCRIPT.md](DEMO_SCRIPT.md) |
| Recording | **To be recorded before Devpost deadline** (app features are complete; owner will publish) |
| Public URL | **Not published yet** — add YouTube, Vimeo, or Youku link here when the video is live |

Requirements when recording (1–3 minutes):

- Show landing page and **Live status** (demo vs live scan mode)
- State selected track: Skin AI
- Sign up or log in
- Show dashboard and **Skin Scan** (upload or bundled sample + stepper)
- Explain YouCam Skin Analysis workflow
- Show Results, Routine, Coach (one question), and Progress
- Mention safety: education only, not medical diagnosis
- Upload publicly to YouTube, Vimeo, or Youku

## Screenshots

Capture per [SCREENSHOTS.md](SCREENSHOTS.md) and store in `public/screenshots/`.

Current assets:

- `project-cover.png` — landing hero (captured)

Remaining captures: sign up, dashboard, scan complete, results, routine, coach, progress, landing live status.

## Judge Testing Instructions

### Fastest path — production

1. Open https://skinova-ai.vercel.app
2. **Get Started** → create an account
3. **Skin Scan** → upload a selfie or choose **Try one of these** (YouCam playground samples)
4. Review **Results**, **Routine**, **Coach**, **Progress**
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

- Scan history is session-based, not yet stored per user in the database
- Progress uses projected scores, not live YouCam Skin Simulation render output
- Product recommendations and affiliate commerce are intentionally deferred
- Full live task testing requires valid YouCam units and a valid front-facing selfie
- Demo video URL will be added when the recording is published

## License And Attribution

- Application source code: [MIT](../LICENSE)
- YouCam API and Perfect Corp. marks belong to their owners
- Do not include copyrighted music or third-party trademarked assets in the demo video unless permission is available
- Sample faces in `public/samples/` are from the YouCam API Playground CDN for demo and smoke testing
