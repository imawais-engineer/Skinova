# Compliance review

Last reviewed: August 16, 2026

## Official requirements

Source of truth:

- https://youcam-api.devpost.com/
- https://youcam-api.devpost.com/rules
- https://youcam-api.devpost.com/resources

## Track

**Skin AI** — Skinova uses YouCam Skin Analysis to help consumers understand skin data and follow a routine.

## Requirement check

| Requirement | Status | Evidence |
| --- | --- | --- |
| Working web prototype | Met | https://skinova-ai.vercel.app and local `npm run dev` |
| At least one YouCam Skin/Fashion API | Met | AI Skin Analysis — full smoke test passes |
| Consumer or retail value | Met | Dashboard, scan, results, routine, coach, progress |
| Not a thin wrapper | Met | End-to-end product flow with education and coaching |
| Repository functional for judges | Met | README, `npm run setup`, docs in `docs/` |
| MIT license | Met | `LICENSE` in repo root |
| Screenshots | Partial | `project-cover.png`; remainder per `SCREENSHOTS.md` |
| 1–3 minute public demo video | Pending recording | Script in `DEMO_SCRIPT.md`; URL when published |
| English materials | Met | Docs and UI in English |
| No third-party copyright issues | Review at capture time | Original UI; no copyrighted music in video |

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
| Scan history not in database | Documented; sessionStorage only |
| Demo video not yet published | Owner records before Devpost deadline |
| `npm audit` PostCSS advisory via Next pinned dep | Revisit when Next ships patched dependency |
| Live API unit consumption | Demo mode for judges without keys |

## Pre-submission checklist

- [ ] Capture remaining screenshots (`docs/SCREENSHOTS.md`)
- [ ] Record and publish demo video; add URL to `SUBMISSION_PACKAGE.md`
- [ ] Confirm production env vars on Vercel
- [ ] Run `npm run youcam:smoke:full` against a sample before final tag
