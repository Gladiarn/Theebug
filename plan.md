# Code Canvas — Project Plan

A VS Code–styled drag-and-drop coding game that teaches JavaScript, HTML, and CSS by having
learners drag the right code block into blanks in real code, coached by a mascot ("Debug the
Worm"). Originally a Figma Make export; rebuilt into a real Next.js app and grown into a small
multi-page platform.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (CSS-variable-driven theme, no separate config file — tokens live in
  `src/app/globals.css` under `@theme inline`)
- `react-dnd` + `react-dnd-html5-backend` — the actual drag-and-drop game mechanic
- `@react-three/fiber` + `three` — the 3D "Debug" creature on the landing page
  (`@react-three/drei` is installed but currently unused — safe to remove, or keep for future
  3D work)
- `lucide-react` — the only icon system in use (no emoji anywhere on site pages by design)
- No backend, no database, no auth. Progress persists client-side only, via
  `src/lib/progress-store.ts` (localStorage, keyed per track).

## Architecture

Two visually-related but separate "zones," both dressed as the same IDE:

- **`/play/[track]/[level]`** — the actual game. `Sidebar` / `EditorArea` / `Terminal` /
  `BottomPanel` / `RightPanel`, wrapped by `MenuBar`. This is the original, most-tested part of
  the app — treat it as the reference implementation when in doubt about a pattern.
- **`(site)` route group** — landing page, `/learn`, `/docs`, `/about`, `/faq`. Wrapped by
  `SiteChrome` (`src/components/site/site-chrome.tsx`), which composes:
  - `SiteTopBar` — thin title bar (hamburger on mobile, logo, centered tagline, GitHub icon,
    theme toggle, small "Start Learning" button)
  - `SiteSidebar` — file-explorer-style nav (`index.tsx`, `learn.md`, `docs.md`, `about.md`,
    `faq.md`), off-canvas drawer below `md`
  - `SiteTabBar` — shows the current page as an "open tab" + breadcrumb
  - page content
  - `SiteFooter` — `manifest.json`-styled block with real links
  - `SiteStatusBar` — bottom bar, accent-blue, VS Code status-bar homage

Content/data lives under `src/lib/`:
- `tracks/` — `javascript.ts`, `html.ts`, `css.ts`, each a `Track` with ordered `Level`s
  (codeLines with `{{zoneN}}` placeholders, `zones` answer key, `blocks` including distractors)
- `reference/` — cheatsheet content for `/docs/[track]`
- `faq-data.ts`, `site-pages.ts` (the sidebar/tab-bar page registry)

## Design system rules (don't break these without deciding to on purpose)

- **Palette**: VS Code Dark+ / Light+ exactly, via CSS custom properties in `globals.css`,
  toggled by a `.light` class on the theme wrapper (`src/lib/theme-context.tsx`). This *is* the
  brand — not a generic dark mode.
- **Type**: JetBrains Mono only (weights 400/500/700), used for both display headlines and body
  copy — deliberate, not an oversight. `.text-display` utility class = bold + tight tracking.
- **No emoji on site pages.** Icons are `lucide-react` only. (The in-game mood system —
  `RightPanel`'s worm faces, `Terminal`'s ✓/✗ — is out of scope for this rule; that's core game
  feedback, not decoration.)
- **Sidebar parity**: the game `Sidebar` and site `SiteSidebar` are deliberately kept in sync —
  same width (`200px`), same header padding, same active-state pattern (border + background +
  small accent dot, full-brightness text otherwise — no dimmed/muted inactive items, matching
  how real VS Code's explorer looks). If you change one, change the other.
- **The 3D worm** (`src/components/site/debug-worm-scene.tsx`) is a procedural
  `CatmullRomCurve3` + `TubeGeometry` body, not a bead chain and not a GLB model. Color is
  computed from the live `--accent` CSS var, darkened via `Color.offsetHSL` so it never blends
  into accent-colored headline text sitting near it. Click it — it does a "celebrating" wiggle.
  Performance choices that matter and shouldn't be casually reverted: `dpr={1}`, `antialias:
  false`, geometry rebuilt only every 3rd frame (not every frame), `frameloop` set to `"never"`
  via `IntersectionObserver` once it's scrolled out of view. Backdrop-blur near the canvas was a
  real perf problem once already — avoid `backdrop-filter` over the hero.
- **CTA buttons** use `bg-accent` + white text + `shadow-[var(--shadow-accent)]` (a
  `color-mix()` formula that tracks `--accent` automatically) — not a separately hardcoded blue.

## Known placeholders / TODO

- `SiteTopBar`'s GitHub icon links to `#` — needs the real repo URL (and optionally Twitter/X or
  Discord alongside it, if those accounts exist).
- `@react-three/drei` is an unused dependency — remove next time deps are touched.
- HTML track has 5 levels, CSS has 6, JS has 5 — fine as a starter set, room to grow.
- GitHub OAuth App credentials (`AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`) still need to be added to
  `.env.local` — sign-in is wired up but won't complete without them. See `.env.example`.

## Accounts + database (built)

Auth: GitHub OAuth only, via Auth.js v5 (`next-auth@beta`). Database: MongoDB Atlas free tier
(M0, permanently free, no inactivity pause), via `@auth/mongodb-adapter` + the native `mongodb`
driver — no ORM. `/play/*` stays fully usable anonymously; signing in migrates local progress to
the DB (keeping whichever side has the higher score per track) and switches persistence from
localStorage to the server going forward.

Env vars (see `.env.example`): `MONGO_URI`, `JWT_SECRET` (Auth.js's session secret — named to
match what was already in this project's `.env.local` rather than Auth.js's own default
`AUTH_SECRET`), `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`.

Key files: `auth.ts` (repo root, NextAuth config), `src/lib/mongodb.ts` (client singleton),
`src/lib/progress-db.ts` (server-side progress reads/writes + leaderboard aggregation),
`src/app/api/progress/` + `src/app/api/progress/sync/` + `src/app/api/account/leaderboard-opt-in/`
(API routes), `src/lib/game-context.tsx` (branches on `useSession()` for hydration/persistence),
`src/components/site/auth-widget.tsx` (header sign-in/avatar, used in both `SiteTopBar` and
`MenuBar` per the sidebar/header-parity rule above), `/account` and `/leaderboard` pages.

Important: the root layout does **not** call `auth()` server-side — that would force every route
in the app out of static generation, since the root layout wraps all of them. `SessionProvider`
fetches the session client-side instead (a brief loading flash on the header avatar, same
tradeoff already accepted for localStorage hydration elsewhere in this app). `/account` and
`/leaderboard` are individually dynamic (`force-dynamic` on the leaderboard, since rankings must
be live) — everything else stays statically generated.

Full original design doc (decision log, build order): `~/.claude/plans/snoopy-dreaming-brooks.md`.

## Design iteration history (so we don't redo the same loop)

1. Figma export → real Next.js App Router app, multi-track platform (JS/HTML/CSS), localStorage
   progress, docs/about/faq pages.
2. First creative pass (git-diff/terminal vocabulary, card-grid sections) — rejected as "too
   common, looks AI-generated."
3. 3D worm + huge kinetic type hero — right direction, but shipped with real bugs: laggy
   (backdrop-blur over the canvas was the main cost), worm's color blended into accent-colored
   text, CTA colors were inconsistent, background felt flat.
4. Full pivot to literal IDE chrome (current state) — sidebar/tabs/status bar site-wide, worm
   rebuilt as a smoother tube creature with click interaction, docs page rebuilt as a real
   documentation layout (sticky section nav + scroll-spy), game/site sidebar and header made
   consistent, a real `MenuBar` vertical-centering bug fixed along the way.

Current state is well-liked. Future changes should be incremental polish, not another full
redesign, unless explicitly asked for.
