# Skinova Build Roadmap

## Phase 1: Functional Prototype

- Create Next.js app shell.
- Implement dashboard-first dark UI.
- Add scan upload flow.
- Add mock analysis endpoint.
- Add results page and routine page.
- Add functional local skin coach.
- Add progress/history page.
- Add settings/API status page.

Validation:

- User can complete the demo path without credentials.
- No broken navigation.
- No core placeholder screens.

## Phase 2: YouCam API Integration Layer

- Add server-side upload metadata route.
- Add presigned upload support boundary.
- Add task creation route.
- Add task polling route.
- Add error mapping.
- Add mock fallback when credentials are missing or demo mode is enabled.

Validation:

- API routes never expose secrets.
- Mock mode works locally.
- UI clearly shows demo/live mode.

## Phase 3: Judging-Visible Completeness

- Polish dashboard metrics.
- Show API usage clearly.
- Show improvement simulation concept.
- Add progress trend cards.
- Add screenshot-ready sections.
- Add responsive checks.

Validation:

- Judges can understand consumer value in under one minute.
- Demo flow can finish inside three minutes.

## Phase 4: Submission Package

- Update README.
- Add setup instructions.
- Add demo script.
- Add submission description.
- Add testing instructions.
- Add compliance notes.
- Add screenshot checklist.

Validation:

- Repo is understandable without private context.
- Required Devpost assets are listed and ready.

## Core Demo-Critical Path

1. Dashboard.
2. Scan.
3. Analysis results.
4. Routine generation.
5. Progress/simulation.
6. Settings/API explanation.
7. Demo script and submission docs.

## Data Model

Prototype uses local mock data first:

- `scan`: uploaded image metadata, mode, created time.
- `analysis`: skin scores, concerns, explanations, YouCam workflow status.
- `routine`: morning steps, night steps, ingredient guidance.
- `progressEntry`: date, acne, redness, texture, hydration, overall score.
- `coachMessage`: user question and local AI-style response.

Stable release persistence target:

- Supabase tables for `profiles`, `scans`, `analysis_results`, `routine_plans`, `progress_entries`, `coach_messages`, and `api_runs`.

## API Integration Plan

- Use server routes only for API keys.
- Use `API_KEY`, `SECRET_KEY`, `BASE_URL`, and `SKINOVA_DEMO_MODE`.
- Default to mock mode when credentials are absent.
- Implement YouCam-style flow: file metadata, presigned upload, task creation, polling, result interpretation.

## What Not To Build

- Do not build a medical diagnosis product.
- Do not build full auth before the core demo.
- Do not build a large product marketplace.
- Do not build complete multi-tenant admin.
- Do not overuse AI chat if the skin analysis flow is incomplete.

## Final V&V Checklist

Verification:

- Working app exists.
- YouCam API usage is shown.
- Consumer value is clear.
- Screenshots and demo script exist.
- Submission docs exist.

Validation:

- Build passes.
- Typecheck passes.
- Main demo path works.
- API mock fallback works.
- UI is readable and responsive.
