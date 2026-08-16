# Compliance review

Last reviewed: August 16, 2026

## Official requirements

Source of truth:

- https://youcam-api.devpost.com/
- https://youcam-api.devpost.com/rules
- https://youcam-api.devpost.com/resources

## Track

**Skin AI** — Skinova uses YouCam Skin Analysis and Skin Simulation to help consumers understand skin data, preview improvement direction, and follow a routine.

## Requirement check

| Requirement | Status | Evidence |
| --- | --- | --- |
| Working web prototype | Met | https://skinova-ai.vercel.app and local `npm run dev` |
| At least one YouCam Skin/Fashion API | Met | AI Skin Analysis + AI Skin Simulation |
| Consumer or retail value | Met | Dashboard, scan, results, routine, coach, progress |
| Not a thin wrapper | Met | End-to-end product flow with education, coaching, and account-backed history |
| Repository functional for judges | Met | README, `npm run setup`, docs in `docs/` |
| MIT license | Met | `LICENSE` in repo root |
| Screenshots | Met | Full set in `public/screenshots/` |
| 1–3 minute public demo video | Deferred (DevTest) | Script in `DEMO_SCRIPT.md`; record after app freeze |
| English materials | Met | Docs and UI in English |
| No third-party copyright issues | Met | Original UI; screenshots use test accounts; no copyrighted music |

## Security and privacy

- Do not commit `.env` or private selfies.
- Do not log YouCam API keys, secrets, file IDs, or presigned URLs.
- Keep YouCam calls server-side (`app/lib/youcam.ts`, API routes).
- Privacy and Terms pages describe handling at `/privacy` and `/terms`.
- Consider rate limiting before high-traffic public deployment.

## Safety positioning

Skinova must not claim to diagnose, treat, cure, or prevent disease.

**Use:** skincare education, personalization, consumer guidance, routine support, progress tracking.

**Avoid:** medical diagnosis, clinical certainty, treatment guarantee, disease detection.

## Current risks

| Risk | Mitigation |
| --- | --- |
| Demo video not yet published | Intentionally deferred during DevTest; script ready |
| Production DB migration for new tables | Run `npm run db:init` on Neon after deploy |
| `npm audit` PostCSS advisory via Next pinned dep | Revisit when Next ships patched dependency |
| Live API unit consumption | Demo mode for judges without keys |
| Simulation preview URL expiry | Documented; re-run simulation if URL expires |

## Pre-submission checklist

- [x] Capture screenshots (`docs/SCREENSHOTS.md`, `public/screenshots/`)
- [x] Two YouCam APIs integrated (Skin Analysis + Skin Simulation)
- [x] Scan history persisted per user in Neon
- [ ] Record and publish demo video; add URL to `SUBMISSION_PACKAGE.md` (after DevTest freeze)
- [ ] Confirm production env vars on Vercel
- [ ] Run `npm run db:init` on production Neon if not done since scan-history deploy
- [ ] Run `npm run youcam:smoke:full` against a sample before final tag
