# Skinova Testing

## Required Checks

```bash
npm run typecheck
npm run build
npm run verify:ui
npm run youcam:smoke
```

## Real YouCam Smoke Test

`npm run youcam:smoke` checks the real YouCam Skin Analysis file metadata endpoint using `.env`. It prints sanitized status only:

- HTTP status
- response status
- error shape if present
- whether a file ID exists
- whether an upload request exists
- whether upload headers exist

It never prints `.env`, API keys, file IDs, or presigned URLs.

## Full Live Workflow Test

Add one valid front-facing test image:

```text
Testing/INPUT/selfie.jpg
Testing/INPUT/selfie.jpeg
Testing/INPUT/selfie.png
```

Then run:

```bash
npm run youcam:smoke:full
```

Or use a temporary remote test image:

```bash
YOUCAM_TEST_IMAGE_URL=https://example.com/front-facing-selfie.jpg npm run youcam:smoke:full
```

Or use a temporary local image outside the repo:

```bash
YOUCAM_TEST_IMAGE_PATH=/tmp/front-facing-selfie.jpg npm run youcam:smoke:full
```

This performs:

1. File metadata request.
2. Presigned upload.
3. Skin Analysis task creation.
4. Polling until success, error, or timeout.

Do not commit private selfies.

## Manual UI Validation

Automated check:

```bash
npm run verify:ui
```

The app must be running before this command. The script checks desktop and mobile scan flows after the demo scan and writes screenshots to `/tmp`.

1. Start the app with `npm run dev`.
2. Open `http://localhost:3000`.
3. Check all navigation items.
4. Run a demo scan.
5. Confirm results display without overlap.
6. Confirm routine page has morning, night, and caution guidance.
7. Ask the coach about redness, acne, routines, and ingredients.
8. Confirm progress page shows a clear trend story.
9. Confirm settings page does not expose secrets.

## Final V&V

Verification:

- All requested prototype pages exist.
- YouCam workflow is implemented server-side.
- Hackathon submission docs exist.

Validation:

- Typecheck passes.
- Production build passes.
- YouCam metadata smoke test passes.
- YouCam full upload/task/poll smoke test passes when a valid temporary image is supplied.
- Manual demo path works.
