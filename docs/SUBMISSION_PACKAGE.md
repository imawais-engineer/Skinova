# Submission Package

## Devpost Description

Skinova is a Skin AI consumer skincare intelligence experience built with YouCam API workflow support. It helps users move from a selfie scan to plain-language skin insights, a personalized routine, progress tracking, and an improvement simulation story.

The product is designed for people who can see changes in their skin but do not know what those changes mean or what to do next. Skinova avoids medical diagnosis and focuses on skincare education, personalization, and consumer guidance.

## YouCam API Usage Explanation

Skinova's selected track is **Skin AI**. The app implements the YouCam Skin Analysis workflow shape:

- file metadata request
- presigned upload
- task creation
- polling
- result normalization into consumer-facing guidance

The app is configured for live scan testing when credentials and a valid front-facing selfie are available. Real metadata smoke testing passed with YouCam credentials from `.env`; the smoke scripts print sanitized status only.

## Repository URL

```text
https://github.com/imawais-engineer/Skinova
```

## Demo Video Checklist

- Show landing page first.
- State selected track: Skin AI.
- Sign up or log in.
- Show dashboard.
- Show scan flow.
- Explain YouCam Skin Analysis workflow.
- Show results page.
- Show routine page.
- Show coach page.
- Show progress page.
- Show Health page.
- Mention safety: education only, not medical diagnosis.
- Keep video between 1 and 3 minutes.
- Upload publicly to YouTube, Vimeo, or Youku.

## Screenshot Checklist

Capture:

- Landing page
- Sign up or login
- Dashboard
- Skin Scan after scan completed
- Results
- Routine
- Skin Coach with one answer
- Progress
- Health

Store local copies in:

```text
public/screenshots/
```

## Judge Testing Instructions

### One-command setup

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

See [docs/VERCEL_NEON_DEPLOY.md](docs/VERCEL_NEON_DEPLOY.md).

### Configure YouCam (optional, for live scans)

Edit `.env` before or after first run:

```env
API_KEY=your_youcam_api_key
SKINOVA_DEMO_MODE=false
```

Demo mode works without YouCam credentials (`SKINOVA_DEMO_MODE=true`).

### End-to-end judge flow

1. Open http://localhost:3000
2. Click **Get Started**
3. Create an account (name, email, password 8+ characters)
4. Land on **/dashboard**
5. Open **Skin Scan** and upload a clear front-facing selfie
6. Review **Results**, **Routine**, **Coach**, **Progress**, and **Health**
7. Confirm **Health** shows demo or live scan mode

### Optional API smoke test

```bash
npm run youcam:smoke
```

Full upload/task/poll test (requires valid selfie at `Testing/INPUT/selfie.jpg`):

```bash
npm run youcam:smoke:full
```

## Known Limitations

- Scan history is session-based, not yet stored per user in the database
- Privacy and Terms pages are placeholders
- Product recommendations are intentionally deferred
- Full live task testing requires valid YouCam units and a valid front-facing selfie

## License And Attribution

- Code: MIT unless changed before final submission.
- YouCam API and Perfect Corp. marks belong to their owners.
- Do not include copyrighted music or third-party trademarked assets in the demo video unless permission is available.
