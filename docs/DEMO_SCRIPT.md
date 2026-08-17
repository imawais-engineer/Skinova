# Demo screen recording guide

Production URL: **https://skinova-ai.vercel.app**

Use this as a **silent screen-record checklist** (no voiceover required). Record 1–3 minutes while clicking through the app. Publish to YouTube, Vimeo, or Youku, then add the link to [SUBMISSION_PACKAGE.md](SUBMISSION_PACKAGE.md).

Pre-flight (run once before recording):

```bash
npm run verify:demo
```

All checks should pass on production.

---

## Recording setup

- Resolution: **1440×900** or **1920×1080** (desktop browser, full window)
- Browser: Chrome or Edge, zoom **100%**
- Hide bookmarks bar; use a clean profile or incognito if needed
- **Do not** show `.env`, API keys, or terminal windows

---

## Click path (~2–3 minutes)

### 1. Landing (15 sec)

1. Open https://skinova-ai.vercel.app
2. Scroll to **Live status** — show **5 YouCam APIs** + **Neon persistence** badges
3. Click **Get Started**

### 2. Sign up + Dashboard (20 sec)

1. Create account (any test email + password 8+ chars)
2. On **Dashboard**, point at journey strip and **scan history** area
3. Click **Skin Scan** in sidebar (note **Analyze → Understand → Decide → Improve** breadcrumb)

### 3. Skin Scan (45 sec)

1. Under **Try one of these**, click **Clear skin** (or any bundled sample)
2. Click **Start live scan with sample**
3. Let the **six-step stepper** run to **Analysis complete**
4. Click **View results**

### 4. Results (30 sec)

1. Show **Overall score** and **Concern breakdown**
2. Scroll to **YouCam personalization** (Fitzpatrick, skin tone, face attributes)
3. In **Concern detection masks**, switch concern tabs — show **Original scan** vs **mask** side-by-side
4. On the right, open **YouCam Skin Simulation** → click **Run Skin Simulation** → wait for before/after
5. Click **Generate routine** or open **Routine** in sidebar

### 5. Routine (20 sec)

1. Show morning/night routine cards (generate if empty)
2. Briefly scroll ingredient guidance

### 6. Skin Coach (25 sec)

1. Open **Skin Coach**
2. Ask: `What should I focus on from my latest scan?`
3. Wait for the grounded reply

### 7. Progress + Simulation (30 sec)

1. Open **Progress**
2. Show trend / history summary
3. Click **Run simulation** (or **Preview improvement**)
4. Wait for **before/after** panels to appear

### 8. Close (10 sec)

1. Return to **Dashboard** or landing
2. Optional: **Log out** and show landing **Live status** again

---

## Tips for a clean recording

| Do | Avoid |
| --- | --- |
| Use bundled **Try one of these** samples | Uploading a random photo that may fail quality checks |
| Wait for stepper and coach reply to finish | Clicking ahead before API polling completes |
| Keep one continuous take if possible | Long pauses on loading spinners (re-record if a call fails) |

---

## Automated verification

```bash
# Full judge-style path against production
npm run verify:demo

# Refresh submission screenshots
npm run capture:screenshots
```

---

## After recording

1. Upload video (public, unlisted is fine)
2. Paste URL into [SUBMISSION_PACKAGE.md](SUBMISSION_PACKAGE.md) and Devpost
3. Confirm screenshots in `public/screenshots/` match the latest UI
