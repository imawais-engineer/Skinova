# Skinova testing

## Automated checks

```bash
npm run typecheck
npm run build
npm run verify:ui
npm run verify:history
npm run verify:rate-limit
npm run verify:all
npm run verify:demo
npm run youcam:smoke
npm run personalization:smoke
npm run coach:smoke "Why is my skin red this week?"
```

Run from the repository root. `verify:ui` requires the dev server at `http://localhost:3000`.

## Real YouCam smoke test

`npm run youcam:smoke` checks the YouCam Skin Analysis file metadata endpoint using `.env`. It prints sanitized status only:

- HTTP status
- response status
- error shape if present
- whether a file ID exists
- whether an upload request exists
- whether upload headers exist

It never prints `.env`, API keys, file IDs, or presigned URLs.

## Full live workflow test

Add one valid front-facing test image:

```text
Testing/INPUT/selfie.jpg
Testing/INPUT/selfie.jpeg
Testing/INPUT/selfie.png
```

Or use a bundled playground sample:

```bash
YOUCAM_TEST_IMAGE_PATH=public/samples/youcam-clear-baseline.jpg npm run youcam:smoke:full
```

Other options:

```bash
YOUCAM_TEST_IMAGE_URL=https://example.com/front-facing-selfie.jpg npm run youcam:smoke:full
YOUCAM_TEST_IMAGE_PATH=/tmp/front-facing-selfie.jpg npm run youcam:smoke:full
```

This performs:

1. File metadata request
2. Presigned upload
3. Skin Analysis task creation
4. Polling until success, error, or timeout

Do not commit private selfies.

## Manual UI validation

1. Start the app: `npm run dev` (or test production at https://skinova-ai.vercel.app)
2. Sign up and land on `/dashboard`
3. Confirm all sidebar navigation works
4. **Dashboard** — after two scans, confirm scan history strip shows count and score delta
5. **Skin Scan** — upload or pick a sample; confirm stepper advances through all six steps
6. **Results** — scores, Fitzpatrick/skin tone personalization, and concern mask overlays render
7. **Routine** — morning, night, and caution sections present
8. **Coach** — ask about redness, acne, routines, ingredients; confirm bounded responses
9. **Progress** — trend cards, scan history, and before/after simulation comparison
10. **Settings** — clear session works; no secrets exposed
11. Log out; landing **Live status** reflects demo or live mode

Automated overflow check:

```bash
npm run verify:ui
```

## Production smoke

After Vercel deploy:

```bash
npm run verify:demo
```

This runs the full judge-style path against https://skinova-ai.vercel.app (sign up → scan → results → routine → coach → progress simulation).

Manual spot-check:

1. Sign up on https://skinova-ai.vercel.app
2. Run one scan (sample recommended)
3. Confirm `GET /api/skinova/health` returns `online` with `databaseReady: true`

## Final V&V

**Verification**

- All product pages exist and are auth-gated where required
- YouCam workflow is implemented server-side
- Documentation and submission package are in `docs/`

**Validation**

- `npm run typecheck` passes
- `npm run build` passes
- `npm run youcam:smoke` passes with valid credentials
- `npm run youcam:smoke:full` passes with a valid test image
- `npm run verify:demo` passes on production
- End-to-end judge flow completes in under three minutes
