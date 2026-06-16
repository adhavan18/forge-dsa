# FORGE — FAANG Prep System

A complete DSA + System Design + Aptitude + CS Fundamentals study tracker.
Built with React + Vite. Deploy to Vercel in under 2 minutes.

## What's inside

- **DSA** — 9 topics with full lesson content, pattern tables, worked examples, and Python templates
- **System Design** — Core concepts + URL Shortener, Twitter, Netflix, WhatsApp walkthroughs
- **Aptitude** — Quantitative, Logical Reasoning, Technical MCQs with explanations
- **CS Fundamentals** — OS, Networks, DBMS, OOP in accordion format
- **Timer** — Pomodoro with ground rules for serious prep
- **Stats** — Per-topic and per-difficulty progress tracking
- **Log** — Daily study journal
- **Search** — Search all 80+ problems by name, pattern, or difficulty

## Deploy to Vercel (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Test locally
npm run dev

# 3. Deploy (one command, requires Vercel CLI)
npx vercel

# OR push to GitHub and connect repo at vercel.com
```

That's it. Vercel auto-detects Vite.

## Local development

```bash
npm install
npm run dev        # starts at http://localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

## File structure

```
src/
  App.jsx          — all UI components
  index.css        — complete design system
  main.jsx         — React entry point
  data/
    dsa.js         — 9 DSA topics with full lesson content
    systemdesign.js — System Design topics
    aptitude.js    — Aptitude questions (3 sections)
    fundamentals.js — CS Fundamentals (4 modules)
```

## Persistence

Progress is stored in `localStorage`. It persists across sessions automatically.
No backend, no auth — everything runs in your browser.
