# Skinova build roadmap

This document tracks what shipped for the hackathon and what comes next.

## Shipped (hackathon MVP)

### Phase 1 — Functional prototype ✅

- Next.js 15 app shell with dashboard-first dark UI
- Skin Scan upload flow with six-step live progress stepper
- Demo mode when YouCam credentials are absent
- Results, Routine, Coach, Progress, and Settings pages
- Landing page with **Live status** (`GET /api/skinova/health`)
- Privacy and Terms pages
- Bundled YouCam playground sample selfies

### Phase 2 — YouCam API integration ✅

- Server-side file metadata, presigned upload, task creation, polling
- Product routes: `POST /api/skinova/scan`, `GET /api/skinova/scan-status/[taskId]`
- `youcam.ts` normalization into `AnalysisResult`
- Sanitized smoke scripts (`npm run youcam:smoke`, `youcam:smoke:full`)
- Demo vs live mode surfaced in UI

### Phase 3 — Judging-visible completeness ✅

- Neon Postgres auth (signup, login, session cookies)
- Skin Coach with knowledge RAG and optional Qwen LLM
- Progress trend cards and improvement simulation story
- Responsive layout and UI verification script
- Production deploy at https://skinova-ai.vercel.app

### Phase 4 — Submission package ✅

- README, architecture, API integration, compliance, demo script
- MIT license, screenshot checklist, judge testing instructions
- Demo video script (recording deferred to owner before Devpost deadline)

## Core demo path (current)

1. Landing → Live status
2. Sign up → Dashboard
3. Skin Scan (upload or sample → stepper → inline results)
4. Results → Routine → Coach → Progress
5. Settings (clear session)

## Data model (current)

| Data | Storage |
| --- | --- |
| User accounts | Neon Postgres (`users`) |
| Coach knowledge | Neon Postgres (embeddings via ingest script) |
| Latest scan session | Browser `sessionStorage` |
| Scan images | Not persisted server-side |

## Near-term improvements (post-hackathon)

- Persist scan history per user in Neon (`scans`, `analysis_results`)
- Integrate YouCam **Skin Simulation** API for real before/after imagery on Progress
- Email verification and password reset
- Rate limiting on scan and coach routes in production
- Additional screenshots for Devpost (`docs/SCREENSHOTS.md`)

## Deferred (out of scope)

- Medical diagnosis or treatment claims
- Product marketplace or affiliate checkout
- Multi-tenant admin console
- Native mobile apps
- Apparel VTO track (Skin AI is the selected track)

## API integration plan (reference)

- Server routes only for `API_KEY`, `SECRET_KEY`, `BASE_URL`
- Default to mock mode when credentials are absent
- YouCam flow: file metadata → presigned upload → task → poll → normalize

## Final V&V checklist

| Check | Status |
| --- | --- |
| Working app (local + production) | Done |
| YouCam Skin Analysis integrated | Done |
| Consumer value clear in under one minute | Done |
| Docs, architecture, roadmap | Done |
| Screenshots (partial — see SCREENSHOTS.md) | In progress |
| Demo video | Record before Devpost deadline |
| `npm run typecheck` / `npm run build` | Run before each release |
