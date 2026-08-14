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

Use the final public repository URL:

```text
https://github.com/imawais-engineer/Skinova
```

## Demo Video Checklist

- Show dashboard first.
- State selected track: Skin AI.
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

- Dashboard
- Skin Scan after demo scan completed
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

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add the required YouCam credentials for live scan testing.
5. Set live scan mode for the local test environment.
6. Run `npm run dev`.
7. Open `http://localhost:3000`.
8. Click "Start scan" and upload a valid front-facing selfie.
9. Review Results, Routine, Coach, Progress, and Health.

Optional live API check:

1. Add YouCam credentials to `.env`.
2. Run `npm run youcam:smoke`.
3. Add `Testing/INPUT/selfie.jpg` for full live upload/task/poll testing.
4. Run `npm run youcam:smoke:full`.

## Known Limitations

- Static example analysis remains available for non-scan pages.
- Persistent scan history is not implemented yet.
- Authentication is not implemented yet.
- Product recommendations are intentionally deferred.
- Full live task testing requires valid YouCam units and a valid local selfie.

## License And Attribution

- Code: MIT unless changed before final submission.
- YouCam API and Perfect Corp. marks belong to their owners.
- Do not include copyrighted music or third-party trademarked assets in the demo video unless permission is available.
