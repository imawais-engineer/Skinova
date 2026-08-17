# Skinova — Project Story

**Live demo:** https://skinova-ai.vercel.app  
**Demo video:** https://youtu.be/3twwbGyQqWA  
**Repository:** https://github.com/imawais-engineer/Skinova  
**Track:** Skin AI (YouCam API Skin AI & Apparel VTO Hackathon)

---

## Inspiration

Most skincare apps give you a score — and then leave you alone.

You might see numbers for acne, pores, redness, or hydration, but still wonder: *What does this actually mean? What should I do next? Is my routine working?*

That gap inspired **Skinova**: a consumer skincare intelligence companion built for the **YouCam API Skin AI** track. We wanted to turn a simple selfie into something useful — understandable insights, practical guidance, and a reason to come back.

Skinova is not positioned as medical diagnosis. It is **skincare education and consumer guidance** — helping people make better routine decisions with clarity instead of confusion.

---

## What it does

Skinova is a full product experience built around **YouCam Skin AI**:

1. **Scan** — Upload a clear, front-facing selfie or choose a bundled YouCam playground sample.
2. **Analyze** — YouCam Skin AI evaluates skin characteristics such as acne, pores, texture, redness, oiliness, moisture, wrinkles, and more.
3. **Understand** — Skinova translates technical scores into plain-language explanations, Fitzpatrick typing, skin tone context, face attributes, and concern detection masks.
4. **Act** — Receive personalized morning and night routine guidance (AI-generated when configured, with Neon persistence).
5. **Ask** — Use the bounded Skin Coach for educational skincare questions, grounded in scan context and curated knowledge (optional Qwen LLM + RAG).
6. **Track** — Follow scan history, trend deltas, and a YouCam Skin Simulation before/after preview on Progress.

The value is not simply *"we called an API once."*

The value is the **continuous journey**:

**Analyze → Understand → Decide → Improve**

---

## How we built it

Skinova is a **Next.js 15** web app using **TypeScript**, **React 19**, and **Tailwind CSS**, deployed on **Vercel** with **Neon Postgres** for accounts, scan history, routines, coach memory, and simulation results.

### Architecture

We separated the product into clear layers.

**Public layer**

- Marketing landing page at `/` with **Live status** (`GET /api/skinova/health`)
- Sign up at `/signup`
- Log in at `/login`
- Privacy and Terms pages

**Authenticated app**

- Dashboard
- Skin Scan (six-step live stepper)
- Results (scores, personalization, concern masks)
- Routine
- Skin Coach
- Progress (trends, history, Skin Simulation)
- Settings (reset scan, routine, or coach data)

**YouCam integration — server-side only**

- `POST /api/skinova/scan`
- `GET /api/skinova/scan-status/[taskId]`
- `POST /api/skinova/simulation`
- `GET /api/skinova/simulation-status/[taskId]`

API keys never touch the browser. The client communicates with Skinova's own server-side API routes.

**Five YouCam APIs in production**

| API | Role in Skinova |
| --- | --- |
| AI Skin Analysis | Primary scan workflow |
| Fitzpatrick Scale Analyzer | Post-scan personalization on Results |
| Skin Tone Analysis | Post-scan tone context on Results |
| Face Analyzer | Face shape, age, and feature context on Results |
| AI Skin Simulation | Before/after preview on Progress |

### YouCam Skin AI workflow

```text
Selfie or sample
   ↓
Secure upload preparation
(file metadata + presigned upload)
   ↓
YouCam Skin AI task creation
   ↓
Polling until analysis completes
   ↓
Personalization enrichment (Fitzpatrick, skin tone, face)
   ↓
Skinova normalization
   ↓
Consumer-friendly guidance
   ↓
Results → Routine → Coach → Progress (simulation)
```

We implemented the real YouCam Skin Analysis pipeline end-to-end:

- File metadata request
- Presigned upload
- Task creation
- Asynchronous polling
- Result handling
- Error mapping
- Consumer-friendly interpretation

Common image/API problems, such as **face too small** or **poor lighting**, are translated into actionable messages for the user.

View the full architecture diagram: [docs/architecture.html](docs/architecture.html) (also in the repo at `docs/architecture.html`).

### Authentication and persistence

We added a real authentication boundary so judges and users enter the product intentionally.

- **Sign up / Log in** with name, email, and password
- Passwords hashed with **bcrypt**
- Sessions stored as signed **JWT** HTTP-only cookies (`jose`)
- Users, scans, routines, coach history, and simulation previews persisted in **Neon Postgres**
- Protected routes enforced through **middleware**
- Per-user rate limits on scan, simulation, coach, and routine routes

### Design

The UI uses a premium dark aesthetic with cyan/emerald accents, journey breadcrumbs (**Analyze → Understand → Decide → Improve**), and a cohesive app shell designed to feel like a real consumer skincare product rather than a hackathon dashboard.

---

## Challenges we ran into

### 1. Turning API output into consumer value

Raw `ui_score` values are not helpful on their own.

We built a normalization layer that converts YouCam output into:

- Concern cards
- Plain-language explanations
- Priorities
- Routine logic
- Concern detection masks
- Fitzpatrick, skin tone, and face personalization context

The goal was to make the AI results understandable to someone who has never used a skin-analysis tool before.

### 2. Building an asynchronous scan workflow

Skin analysis is not instant.

We implemented:

- Upload states
- A six-step progress stepper
- Polling
- Loading feedback
- Success states
- Failure states
- Actionable error messages

This makes the experience feel like a real product instead of a raw API demonstration.

### 3. Product architecture refactor

We moved from a temporary dashboard-first prototype to a proper:

**Public Landing Page → Authentication → Authenticated Product**

without breaking the existing YouCam integration — then extended it with Neon-backed scan history, routines, coach memory, and simulation persistence.

### 4. Balancing ambition with hackathon scope

There are many directions Skinova could take.

Instead of over-building marketplace, medical, or affiliate features, we focused on a complete core experience:

**Scan → Explain → Guide → Track → Simulate**

### 5. Safety and compliance

We deliberately avoided medical diagnosis language and treatment claims.

Skinova is positioned as **educational skincare guidance**, not a medical diagnostic system.

### 6. Keeping preview images aligned with mask overlays

Results compare an **original scan** with YouCam **concern masks**. We persisted `preview_image_url` and `sample_id` in Neon so the correct source photo survives reloads, device changes, and account return visits — not just the current browser session.

---

## Accomplishments that we're proud of

- Built a complete consumer-facing skincare experience instead of a single API wrapper.
- Integrated **five YouCam Skin AI APIs** with a live production deployment.
- Added a proper public landing page and authenticated application architecture.
- Implemented real **sign-up and login** with Neon-backed persistence.
- Kept YouCam API credentials strictly server-side.
- Built asynchronous scan and simulation processing with task polling and error handling.
- Converted technical AI results into consumer-friendly skincare insights with masks and personalization.
- Connected analysis to AI routine guidance, RAG-grounded Skin Coach, and progress tracking with simulation.
- Created a polished, responsive UI with journey breadcrumbs and scan history.
- Published a silent screen demo video and full submission documentation.
- Maintained clear safety boundaries by avoiding medical diagnosis and treatment claims.

Most importantly, we turned:

**"Analyze my skin."**

into:

**"Understand my skin → know what to do → track what changes → preview improvement direction."**

---

## What we learned

- **API integration is only half the product.** Judges and users care about what happens *after* the scan.
- **YouCam's image requirements matter.** Front-facing selfies with the face filling an appropriate portion of the frame and sufficient lighting produce better results.
- **Server-side boundaries are essential.** Keeping YouCam credentials, authentication secrets, and password hashes away from the client makes the architecture safer and easier to reason about.
- **Async workflows need good UX.** Users should always understand whether their image is uploading, processing, completed, or failed.
- **Technical output needs interpretation.** Raw AI scores are much less valuable than clear explanations, masks, and actionable context.
- **Demo mode vs. live mode** makes the application easier to test when API units or credentials are limited.
- **Persistence matters for trust.** Scan history, routines, coach threads, and simulation previews should survive reloads — Neon is the source of truth; the browser is a cache.
- **A focused product beats an oversized prototype.** A complete scan → explain → guide → track journey demonstrates more value than many disconnected features.

---

## What's next for Skinova

Skinova's current focus is proving the core consumer experience. The next stage would be turning that foundation into a deeper long-term skincare intelligence platform.

Potential next steps include:

- **Long-term skin history** with richer trend analysis across many scans.
- **Personalized routine evolution** based on repeated scans and adherence signals.
- **Smarter progress comparisons** across weeks and months.
- **More advanced Skin Coach capabilities** with stronger personalization and safety controls.
- **Product-aware recommendations** connected to a user's specific skin concerns.
- **Routine adherence tracking** to understand whether users are consistently following their routine.
- **Deeper YouCam API capabilities** as additional Skin AI features become relevant.
- **Privacy-focused user controls** for managing and deleting personal skin-analysis data.
- **Mobile-first experiences** for making regular skin scans easier.
- Eventually, a broader **skin intelligence platform** that connects analysis, education, routine decisions, and measurable progress in one place.

The long-term vision is simple:

> **Skinova shouldn't just tell you what your skin looks like today. It should help you understand your skin, make better decisions, and see how those decisions change your journey over time.**

---

## Try it yourself

**Fastest path — production**

1. Open https://skinova-ai.vercel.app
2. Click **Get Started** and create an account (or log in).
3. Open **Skin Scan** — upload a selfie or pick **Try one of these** (YouCam playground sample).
4. Wait for the six-step scan to complete.
5. Explore **Results**, **Routine**, **Skin Coach**, and **Progress** (run Skin Simulation on Progress).
6. Log out and note **Live status** on the landing page.

**Local setup**

```bash
git clone https://github.com/imawais-engineer/Skinova.git
cd Skinova
npm run setup
```

Then:

1. Open http://localhost:3000
2. Add `DATABASE_URL` from [Neon](https://neon.tech) to `.env` and run `npm run db:init`
3. Click **Get Started** and create an account
4. Follow the same scan → results → routine → coach → progress flow

**Pre-flight check (production)**

```bash
npm run verify:demo
```

---

## Disclaimer

Skinova provides **educational skincare information and AI-assisted analysis**.

It does not diagnose medical conditions, provide medical treatment, or replace professional medical advice.
