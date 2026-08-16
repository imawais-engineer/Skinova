# Skinova submission screenshots

Devpost and README assets captured from **https://skinova-ai.vercel.app** at 1440×900 desktop width.

| File | Screen |
| --- | --- |
| `project-cover.png` | Landing page hero and value proposition |
| `landing-live-status.png` | Landing **Live status** section |
| `signup.png` | Sign up form |
| `dashboard.png` | Dashboard after login |
| `scan-complete.png` | Skin Scan with completed analysis and stepper |
| `results.png` | Results page with concern scores |
| `routine.png` | Personalized routine |
| `coach.png` | Skin Coach with one answered question |
| `progress.png` | Progress tracking and simulation |

## Regenerate

```bash
npm run capture:screenshots
```

Uses Playwright against production (or `SKINOVA_CAPTURE_URL`). Requires network access and a clean test signup per run.

## Notes

- No API keys, secrets, or private user data appear in captures.
- Re-capture after major UI changes before final Devpost submission.
- **Do not** commit screenshots at the repository root — keep all submission assets in this folder only (`public/screenshots/`).
