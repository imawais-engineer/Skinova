# SKINOVA

<p align="center">
  <img src="assets/logo.png" alt="Skinova Logo" width="180"/>
</p>

<h1 align="center">SKINOVA</h1>

<p align="center">
<b>Understand Your Skin. Improve with Intelligence.</b>
</p>

<p align="center">
AI-powered Skin Intelligence Platform built with <b>YouCam AI APIs</b>, <b>OpenAI</b>, and modern web technologies.
</p>

---

## Overview

**SKINOVA** is an AI Skin Intelligence Platform designed to help users understand, monitor, and improve their skin through personalized AI-powered insights.

Unlike traditional skin scanner applications that only generate one-time reports, Skinova combines multiple AI services into a continuous skincare companion capable of analyzing skin, explaining results, creating routines, tracking progress, and providing intelligent skincare guidance.

This project is being developed for the **YouCam API Skin AI Hackathon 2026**.

---

# Vision

Empower everyone with a professional AI skin companion capable of:

- Understanding skin health
- Explaining AI analysis in human language
- Creating personalized skincare routines
- Tracking long-term skin progress
- Educating users about ingredients
- Providing intelligent skincare coaching

---

# Core Problem

Millions of people struggle to answer questions like:

- Why is my skin changing?
- Which skincare products actually suit me?
- Is my routine working?
- What ingredient should I avoid?
- Is my skin improving over time?

Current applications typically stop after providing an analysis.

**Skinova continues the journey.**

---

# Key Features

## AI Skin Scan

Powered by **YouCam AI Skin Analysis**

Features

- Acne Detection
- Wrinkle Detection
- Dark Circles
- Redness
- Oiliness
- Dryness
- Pores
- Skin Texture
- Overall Skin Health Score

---

## AI Skin Simulation

Visualize expected improvements based on personalized skincare recommendations.

Users can compare:

- Current Skin
- Predicted Skin Improvement

---

## AI Skin Intelligence

Instead of showing numbers only,

Example

> Acne Score: 61%

Skinova explains:

> Your skin shows mild inflammatory acne concentrated around the chin and forehead. This pattern commonly appears due to excess oil production and clogged pores. A gentle cleansing routine combined with Niacinamide may help reduce future breakouts.

---

## Personalized Routine Generator

Morning Routine

- Cleanser
- Serum
- Moisturizer
- Sunscreen

Night Routine

- Cleanser
- Treatment
- Moisturizer

Generated dynamically using AI based on skin analysis.

---

## AI Skin Coach

Interactive AI assistant capable of answering questions such as

- Why is my skin oily?
- Can I use Vitamin C?
- Is Niacinamide suitable?
- Why is my acne worse this week?
- What ingredient should I avoid?

---

## Ingredient Intelligence

Search any skincare ingredient.

Examples

- Niacinamide
- Retinol
- Salicylic Acid
- Hyaluronic Acid

Learn

- Benefits
- Side Effects
- Skin Compatibility
- Usage Tips
- Ingredient Conflicts

---

## Progress Tracking

Monitor skin improvements through periodic scans.

Metrics include

- Acne
- Redness
- Hydration
- Texture
- Wrinkles

Timeline visualization allows users to compare previous analyses.

---

## Product Advisor

Based on

- Skin Condition
- Goals
- Budget
- Country

Skinova recommends skincare products together with AI explanations.

---

# AI APIs Used

## Primary APIs

| API | Purpose |
|------|----------|
| AI_SKIN_ANALYSIS | Core skin diagnosis |
| AI_SKIN_SIMULATION | Skin improvement visualization |
| AI_FITZPATRICK_SKIN_TYPE_ANALYSIS | Skin type classification |
| AI_FACIAL_COLOR_TONES_ANALYZER | Skin tone detection |
| AI_FACE_ATTRIBUTES_&_RATIO_ANALYZER | Additional facial insights |
| AI_PHOTO_ENHANCE | Improve image quality before analysis |

Each API has its own dedicated documentation folder containing:

- Markdown Documentation
- OpenAPI Specification (YAML)
- OpenAPI Specification (JSON)

---

# Project Structure

```text
Skinova/

├── AI_SKIN_ANALYSIS/
│   ├── AI_SKIN_ANALYSIS.md
│   ├── openapi.yaml
│   └── openapi.json
│
├── AI_SKIN_SIMULATION/
│
├── AI_FITZPATRICK_SKIN_TYPE_ANALYSIS/
│
├── AI_FACIAL_COLOR_TONES_ANALYZER/
│
├── AI_FACE_ATTRIBUTES_&_RATIO_ANALYZER/
│
├── AI_PHOTO_ENHANCE/
│
├── app/
├── backend/
├── docs/
├── public/
├── .env.example
├── README.md
└── LICENSE
```

---

# Technology Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Backend

- FastAPI
- Python

---

## Database

- Supabase PostgreSQL

---

## Storage

- Supabase Storage

---

## Authentication

- Supabase Auth

---

## AI

- OpenAI Responses API

---

## Deployment

Frontend

- Vercel

Backend

- Railway
- Render

---

# Environment Variables

Copy

```bash
cp .env.example .env
```

Configure

```env
API_KEY=
SECRET_KEY=
BASE_URL=
```

---

# Development Roadmap

## Phase 1

- Project Initialization
- Authentication
- Dashboard
- Image Upload

---

## Phase 2

- AI Skin Analysis Integration
- Results Dashboard
- Scan History

---

## Phase 3

- AI Explanations
- Routine Generator
- AI Skin Coach
- Ingredient Intelligence

---

## Phase 4

- Skin Simulation
- Progress Timeline
- Product Recommendations
- Dashboard Polish

---

## Phase 5

- Testing
- Performance Optimization
- Documentation
- Demo Video
- Devpost Submission

---

# Demo Flow

1. User signs in
2. Uploads selfie
3. AI Photo Enhance improves image quality
4. AI Skin Analysis generates report
5. AI explains findings
6. Personalized skincare routine generated
7. User chats with AI Skin Coach
8. Progress history displayed
9. AI Skin Simulation predicts future improvement
10. Product recommendations generated

---

# Why Skinova?

Skinova is not another skin scanner.

It is an intelligent skincare companion that combines multiple AI services into a seamless experience focused on education, personalization, and long-term skin health.

The goal is to demonstrate meaningful AI integration, exceptional user experience, and real consumer value.

---

# Repository Status

Current Development Phase

- Documentation ✅
- API Research ✅
- OpenAPI Specifications ✅
- Environment Configuration ✅
- Architecture Design ✅
- Frontend Development ⏳
- Backend Development ⏳
- AI Integration ⏳

---

# Hackathon

Built for

**YouCam API Skin AI Hackathon 2026**

---

# License

This project is released under the MIT License.

---

<p align="center">
<b>SKINOVA</b><br>
Understand Your Skin. Improve with Intelligence.
</p>
