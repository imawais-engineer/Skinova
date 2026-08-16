# YouCam hackathon intake

Summary of official rules and how Skinova maps to them. Production app: **https://skinova-ai.vercel.app**

## Current repo status

| Area | Status |
| --- | --- |
| Working Next.js 15 web app | Shipped |
| YouCam Skin Analysis integration | Shipped (server-side) |
| Neon Postgres auth | Shipped |
| Dashboard, scan, results, routine, coach, progress | Shipped |
| Landing live status, privacy, terms | Shipped |
| Documentation (`docs/`) | Shipped |
| MIT license | Shipped |
| Screenshots | Complete (`public/screenshots/`) |
| Demo video | Script ready; recording after DevTest freeze |

Repository: https://github.com/imawais-engineer/Skinova

## Official hackathon requirements

Sources:

- Overview: https://youcam-api.devpost.com/
- Rules: https://youcam-api.devpost.com/rules
- Resources: https://youcam-api.devpost.com/resources

**Mandatory build**

- Working web or mobile prototype
- At least one Perfect Corp. YouCam API (Skin or Fashion)
- Clear consumer or retail value
- More than a surface-level single API call
- Consistent behavior matching demo video and description

## Submission requirements

- Public repository URL (or private + shared with `contact_event@PerfectCorp.com`)
- Source, assets, and setup instructions
- English text description
- Screenshots
- 1–3 minute public demo video (YouTube, Vimeo, or Youku)
- Video shows end-to-end flow and which YouCam API is used

## Judging criteria (Stage Two, equal weight)

| Criterion | Skinova evidence |
| --- | --- |
| Technological implementation | Server-side YouCam workflow, polling, normalization, demo/live modes |
| Design | Coherent dashboard product, scan stepper, results through progress |
| Potential impact | Turns scores into routines and education for everyday consumers |
| Quality of idea | Continuous companion vs one-time scanner |

**Stage One:** fit theme + apply required APIs.

## Compliance risks

- Do not expose API keys in client code or commits
- No medical diagnosis language
- No copyrighted music or unlicensed trademarks in demo media
- App must be runnable by judges (`npm run setup` or production URL)
- Attribute YouCam / Perfect Corp. per their terms

## Skinova direction (winning narrative)

> Skinova turns a selfie into a guided skincare action plan: YouCam Skin Analysis, plain-language insights, personalized routines, bounded coach Q&A, and progress tracking in one consumer dashboard.

## Remaining submission assets

1. ~~Finish screenshot set (`docs/SCREENSHOTS.md`)~~ — done in `public/screenshots/`
2. Record demo video (`docs/DEMO_SCRIPT.md`) — after DevTest / app freeze
3. Add video URL to `docs/SUBMISSION_PACKAGE.md` on Devpost
