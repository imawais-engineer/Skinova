# Skinova winning product strategy

Production: **https://skinova-ai.vercel.app**

## One-sentence concept

Skinova is an AI skincare intelligence companion that converts a user selfie into understandable skin insights, personalized routines, progress tracking, and a realistic improvement story using the YouCam Skin Analysis API.

## Target user

Skincare consumers who feel uncertain about their skin concerns, product choices, and whether their routine is working.

Secondary audiences:

- Skincare retailers that want guided product discovery
- Beauty advisors who want AI-assisted education tools
- Consumers preparing to buy skincare products online

## Core problem

Most skin scanner experiences stop at a score. Users still need to know what the score means, what action to take, which ingredients match their skin, and whether their skin is improving over time.

## Minimum winning demo

1. User opens the Skinova dashboard.
2. User uploads a selfie or selects a bundled YouCam playground sample.
3. Skinova runs live skin analysis (or demo mode) with a visible stepper.
4. Results explain acne, pores, redness, texture, oiliness, dryness, and overall skin health in plain language.
5. Routine generates morning and night steps.
6. Progress shows trend movement and an improvement story.
7. Landing **Live status** shows demo vs live scan readiness.

## Rubric-to-feature map

| Judging area | Skinova evidence |
| --- | --- |
| Technological implementation | Server-side YouCam integration, polling, normalization, demo/live modes |
| Design | Dashboard-first UI, scan stepper, results, routine, coach, progress |
| Potential impact | Helps consumers interpret skin insights and act with routine guidance |
| Quality of idea | Continuous skincare companion rather than a one-time API wrapper |

## Shipped for hackathon

- Dashboard-first app shell with auth
- Upload/scan flow with six-step progress UI
- YouCam Skin Analysis (live + mock)
- Results interpretation and routine generator
- Skin Coach (RAG + optional Qwen LLM)
- Progress timeline and simulation story
- Landing live status, privacy, terms
- Submission documentation and MIT license

## Deferred

- Per-user scan history in Neon
- Live YouCam Skin Simulation imagery on Progress
- Payment/product affiliate logic
- Real product catalog
- Medical condition diagnosis
- Email verification / password reset
- Native mobile app
- Apparel VTO track

## Demo story

Skinova starts with a familiar frustration: users can see skin changes, but do not know what they mean or what to do next. The demo shows a selfie upload, AI skin analysis, plain-language explanation, routine plan, coach Q&A, and progress loop. The story is not "we called an API"; it is "we turned technical skin scores into consumer action and confidence."

## Technical differentiation

- End-to-end product flow around YouCam Skin Analysis
- API keys stay server-side
- Consumer-safe unavailable states in demo mode
- Analysis structured into scores, explanations, routines, and progress
- Bounded coach prompts (see `AI_PROMPT_CONTRACTS.md`)

## Compliance and safety

- Skincare education and consumer guidance — not medical diagnosis
- No disease claims or treatment promises
- User consent language for images (privacy policy)
- Do not expose API secrets
- Attribute YouCam API usage
- Demo video under three minutes when recorded
