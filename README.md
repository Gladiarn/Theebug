# Theebug

**Learn to code by fixing it, not writing it from scratch.**

Theebug is a VS Code–styled, drag-and-drop coding game. Every level is real, working code with
a few pieces missing — drag the correct block into place and watch it resolve, coached by
**Debug the Worm** every step of the way.

🔗 **Live:** [theebug.cc.cd](https://www.theebug.cc.cd)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

---

## Why

Most coding tutorials teach by reading, then ask you to write code on a blank page — the
single biggest place beginners freeze up. Theebug flips that: you're never staring at an empty
editor wondering where to start. You're recognizing patterns, testing hypotheses, and getting
instant feedback on every choice. Wrong guesses cost nothing but a second try.

## Features

- 🧩 **Drag-and-drop levels** across seven courses — JavaScript, Python, HTML, CSS, React,
  Node.js, and MongoDB, spanning frontend, backend, and databases — real code with
  fill-in-the-blank zones, distractor blocks, and instant correctness feedback
- 📊 **Difficulty tiers** (Beginner / Intermediate / Advanced) per track, so lessons scale from
  first-timer to genuinely challenging
- 🏆 **A real scoring system** — difficulty-weighted base scores, a speed bonus, a streak bonus
  for consecutive clean levels, and an optional hint system with a cost (see below) — plus a star
  rating and a "what you just learned" recap on every completion
- 📚 **A real documentation section** — not an afterthought: deep per-language reference docs
  with a sticky, scroll-spy sidebar
- 👤 **Optional accounts** via GitHub OAuth — play fully anonymously with progress in
  `localStorage`, or sign in to sync across devices and opt into the public leaderboard
- 🌓 **Full light/dark theming** — a faithful VS Code Dark+ / Light+ palette, one CSS variable
  drives every themed surface
- ♿ Keyboard-accessible modals, a themed 404/error experience, and a mascot that actually
  reacts (proud, sad, celebrating) instead of a static icon

## Scoring system

Every level's score is built from five independent pieces, so two players rarely land on the
exact same total — designed to reward mastery without punishing anyone for learning at their own
pace.

| Component | How it works |
|---|---|
| **Base score** | Set by difficulty — Easy 100 / Medium 150 / Hard 200. A hard level is always worth more than an easy one. |
| **Mistake penalty** | −10% of base per wrong drop, floored at 40% of base — a rough attempt still earns something. |
| **Hint penalty** | −20% of base per hint used (see below) — double a mistake's cost, since it reveals the actual answer. |
| **Speed bonus** | Up to **+20%** of base for finishing well under a per-level time budget, tapering to 0% right at that budget. Never negative — taking your time never costs anything beyond simply not earning this bonus. |
| **Streak bonus** | +5% of base for every consecutive level completed with **zero mistakes and zero hints**, up to +25% at a 6-level streak. Breaks back to zero the moment any level isn't clean. |

**Hints**: stuck on a blank? The "Use a hint" button highlights the correct block for the next
empty slot — you still have to drag it yourself, it's never auto-filled — at the cost above.
Every level's reward screen shows the full breakdown (base, penalties, bonuses) so the system is
never a mystery number.

Replaying an already-completed level only ever *helps*: your best-ever score and fastest-ever
time for that level are tracked independently, so a bad replay can never drag your total down and
a good one always can raise it.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com), CSS-variable-driven theme (no config file) |
| Drag & drop | [react-dnd](https://react-dnd.github.io/react-dnd/) (HTML5 backend) |
| 3D | [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) — the landing page's hero creature |
| Auth | [Auth.js v5](https://authjs.dev) (GitHub OAuth), database sessions |
| Database | MongoDB Atlas (free tier), native driver — no ORM |
| Testing | [Vitest](https://vitest.dev) (unit) + [Playwright](https://playwright.dev) (E2E) |
| Hosting | [Vercel](https://vercel.com) |

## Getting started

```bash
git clone https://github.com/Gladiarn/Theebug.git
cd Theebug
npm install
```

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 cluster connection string |
| `JWT_SECRET` | Generate with `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | A [GitHub OAuth App](https://github.com/settings/developers), callback URL `http://localhost:3000/api/auth/callback/github` |

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). Note: `/play/*` is fully playable without any of
the above configured — accounts and the leaderboard are the only things that need it.

## Scripts

| Command | Does what |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |

## Project structure

```
src/
  app/            Next.js App Router — game routes (/play) + marketing site ((site) group)
  components/
    game/         The actual drag-and-drop game UI
    site/         Landing page, docs, nav, footer
  lib/
    tracks/       Level content per language (JS, Python, HTML, CSS, React)
    reference/    Docs/reference content per language
e2e/              Playwright end-to-end tests
```

## Deployment

Deployed on Vercel. Pushes to `main` build and deploy automatically; `dev` branch pushes get a
preview deployment. See `plan.md` for the full architecture write-up and decision log.

---

<sub>Built by [Gladiarn](https://github.com/Gladiarn) · Break it. Debug it. Own it.</sub>
