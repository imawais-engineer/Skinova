# Compliance Review

## Official Requirements

Source of truth:

- https://youcam-api.devpost.com/
- https://youcam-api.devpost.com/rules
- https://youcam-api.devpost.com/resources

## Track

Selected track: **FIRST TRACK - Skin AI**.

Reason: Skinova uses YouCam Skin AI concepts to help consumers understand skin data and decide what to do next.

## Requirement Check

| Requirement | Status | Evidence |
| --- | --- | --- |
| Working web or mobile prototype | In progress, implemented locally | Next.js app under `app/` |
| At least one YouCam Skin/Fashion API | Met for Skin AI integration | Full real Skin Analysis smoke passed with sanitized output |
| Consumer or retail value | Met | Dashboard, results, routine, progress |
| Not a thin wrapper | Met | End-to-end scan, explanation, routine, coach, progress |
| Repository functional for judges | In progress | README, setup, smoke scripts |
| Screenshots | Pending | Add final screenshots to `public/screenshots/` |
| 1-3 minute public demo video | Pending | Script exists in `docs/DEMO_SCRIPT.md` |
| English materials | Met | Docs and UI are English |
| No third-party copyright/trademark issues | Needs final review | Use original screenshots and no copyrighted music |

## Security And Privacy

- Do not commit `.env`.
- Do not print YouCam API keys, secrets, file IDs, or presigned upload URLs in logs.
- Do not commit private user selfies.
- Keep API calls server-side.
- Add rate limiting before public deployment if live API mode is exposed.

## Safety Positioning

Skinova must not claim to diagnose, treat, cure, or prevent disease. Use these terms:

- skincare education
- personalization
- consumer guidance
- routine support
- progress tracking

Avoid these claims:

- medical diagnosis
- clinical certainty
- treatment guarantee
- disease detection

## Current Risks

- Auth and persistence are deferred until after functional prototype validation.
- Screenshots and public demo video still need to be produced before Devpost submission.
- `npm audit` still reports a PostCSS advisory through Next's pinned internal `postcss@8.4.31`; npm's suggested fix is an unsafe downgrade to Next 9, so this should be revisited when Next publishes a stable patched dependency.
