# Screenshot checklist

Store submission screenshots in `public/screenshots/`. Use PNG format at desktop width (1280px or wider). Do not include private user data or API secrets.

Production URL for captures: **https://skinova-ai.vercel.app**

## Required captures

| # | Screen | Filename | Status |
| --- | --- | --- | --- |
| 1 | Landing page (hero + value prop) | `project-cover.png` | Done |
| 2 | Sign up or login | `signup.png` | Done |
| 3 | Dashboard | `dashboard.png` | Done |
| 4 | Skin Scan — completed scan / stepper | `scan-complete.png` | Done |
| 5 | Results | `results.png` | Done |
| 6 | Routine | `routine.png` | Done |
| 7 | Skin Coach (one answered question) | `coach.png` | Done |
| 8 | Progress | `progress.png` | Done |
| 9 | Landing **Live status** section | `landing-live-status.png` | Done |

## How to capture

1. Use a clean test account (not production user PII).
2. Run a scan with a bundled sample (`Try one of these`) for consistent results.
3. Crop to the main content; avoid browser chrome with personal bookmarks.
4. Commit files to `public/screenshots/` before Devpost submission.

Automated capture:

```bash
npm run capture:screenshots
```

## README usage

The root [README.md](../README.md) references `project-cover.png` as the repo cover image. Update that file if you replace the landing hero capture.

See also [public/screenshots/README.md](../public/screenshots/README.md) for the asset index.
