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

The demo defaults to mock-safe mode so judges can run the app without consuming API units. Real metadata and full upload/task/poll smoke testing passed with YouCam credentials from `.env`; the smoke scripts print sanitized status only.

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
- Settings/API configuration

Store local copies in:

```text
public/screenshots/
```

## Judge Testing Instructions

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Leave `SKINOVA_DEMO_MODE=true` for the reliable demo path.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.
7. Click "Start scan" and run the demo scan.
8. Review Results, Routine, Coach, Progress, and Settings.

Optional live API check:

1. Add YouCam credentials to `.env`.
2. Run `npm run youcam:smoke`.
3. Add `Testing/INPUT/selfie.jpg` for full live upload/task/poll testing.
4. Run `npm run youcam:smoke:full`.

## Known Limitations

- Prototype uses local mock analysis for default judge safety.
- Persistent scan history is not implemented yet.
- Authentication is not implemented yet.
- Product recommendations are intentionally deferred.
- Full live task testing requires valid YouCam units and a valid local selfie.

## License And Attribution

- Code: MIT unless changed before final submission.
- YouCam API and Perfect Corp. marks belong to their owners.
- Do not include copyrighted music or third-party trademarked assets in the demo video unless permission is available.
