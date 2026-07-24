# Skinova

Skinova is a dashboard-first consumer skincare intelligence app for the YouCam API Skin AI & Apparel VTO Hackathon.

Selected hackathon track: **FIRST TRACK - Skin AI**.

Skinova converts a selfie scan into skin insights, routine guidance, progress tracking, and a realistic improvement story. It is positioned as skincare education and consumer guidance, not medical diagnosis.

## Hackathon Fit

- Working web prototype built with Next.js, TypeScript, and Tailwind CSS.
- Uses YouCam Skin AI workflow design: file metadata, presigned upload, task creation, polling, and result interpretation.
- Demonstrates consumer value beyond one API call: scan, explain, guide, track, and simulate.
- Keeps YouCam API keys server-side only.
- Includes mock fallback for reliable judging demos and real API smoke testing for integration validation.

Official hackathon sources:

- Overview: https://youcam-api.devpost.com/
- Rules: https://youcam-api.devpost.com/rules
- Resources: https://youcam-api.devpost.com/resources

## Product Flow

1. Dashboard explains Skinova's value and YouCam API usage.
2. Skin Scan uploads a selfie or runs a demo-safe scan.
3. Results converts YouCam-style scores into plain-language skincare education.
4. Routine generates morning and night guidance.
5. Skin Coach answers limited local skincare questions with safety boundaries.
6. Progress shows trend history and improvement simulation story.
7. Settings shows server-side API configuration status without exposing secrets.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide icons
- Server-side YouCam API routes

Supabase persistence, authentication, and authorization are intentionally deferred until after the functional prototype is validated.

## Environment

Create `.env` from `.env.example`.

```bash
cp .env.example .env
```

Required names:

```env
API_KEY=YOUCAM_API_KEY
SECRET_KEY=YOUCAM_SECRET_KEY
BASE_URL=https://yce-api-01.makeupar.com
SKINOVA_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Set `SKINOVA_DEMO_MODE=false` only when you want the app to create live YouCam tasks. The API key is used only in server routes and scripts.

## Local Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

```bash
npm run typecheck
npm run build
npm run verify:ui
npm run youcam:smoke
```

`npm run youcam:smoke` validates the real YouCam Skin Analysis file metadata request using `.env`, but prints only sanitized status fields.

`npm run verify:ui` expects the app to be running at `http://localhost:3000` or `SKINOVA_TEST_URL`. It clicks the demo scan in desktop and mobile viewports, captures screenshots in `/tmp`, and fails on horizontal overflow.

For a full real upload/task/poll smoke test, add a valid front-facing test image:

```text
Testing/INPUT/selfie.jpg
Testing/INPUT/selfie.jpeg
Testing/INPUT/selfie.png
```

Then run:

```bash
npm run youcam:smoke:full
```

You can also test with a temporary remote image URL without storing it in the repo:

```bash
YOUCAM_TEST_IMAGE_URL=https://example.com/front-facing-selfie.jpg npm run youcam:smoke:full
```

Or use a temporary local image outside the repo:

```bash
YOUCAM_TEST_IMAGE_PATH=/tmp/front-facing-selfie.jpg npm run youcam:smoke:full
```

Do not commit private selfies or `.env`.

## YouCam API Workflow

The app implements these server-side routes:

- `POST /api/youcam/upload-metadata`
- `POST /api/youcam/task`
- `GET /api/youcam/task-status/[taskId]?workflow=skin-analysis`
- `POST /api/youcam/analyze`

The current demo focuses on `AI_SKIN_ANALYSIS`. Supporting local docs are included for:

- `AI_SKIN_ANALYSIS`
- `AI_SKIN_SIMULATION`
- `AI_FITZPATRICK_SKIN_TYPE_ANALYSIS`
- `AI_FACIAL_COLOR_TONES_ANALYZER`
- `AI_FACE_ATTRIBUTES_&_RATIO_ANALYZER`
- `AI_PHOTO_ENHANCE`

## Demo Script

See [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## Submission Package

See [docs/SUBMISSION_PACKAGE.md](docs/SUBMISSION_PACKAGE.md) and [docs/COMPLIANCE_REVIEW.md](docs/COMPLIANCE_REVIEW.md).

## Known Limitations

- Prototype data is local mock data unless live YouCam mode is enabled.
- No authentication or persistent user accounts yet.
- No medical diagnosis, treatment claims, or disease detection.
- Full real scan testing requires a valid local test selfie and YouCam API units.

## License

MIT, unless replaced by a different project license before submission.
