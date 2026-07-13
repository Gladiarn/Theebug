# Theebug — Project Plan

A VS Code–styled drag-and-drop coding game that teaches JavaScript, Python, HTML, and CSS by
having learners drag the right code block into blanks in real code, coached by a mascot
("Debug the Worm"). Originally a Figma Make export (then called "Code Canvas," renamed to
match the repo); rebuilt into a real Next.js app and grown into a small multi-page platform
with accounts, a leaderboard, and a growing course catalog.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (CSS-variable-driven theme, no separate config file — tokens live in
  `src/app/globals.css` under `@theme inline`)
- `react-dnd` + `react-dnd-html5-backend` — the actual drag-and-drop game mechanic
- `@react-three/fiber` + `three` — the 3D "Debug" creature on the landing page
  (`@react-three/drei` is installed but currently unused — safe to remove, or keep for future
  3D work)
- `lucide-react` — general site icons (no emoji anywhere on site pages by design)
- `react-icons/si` (Simple Icons) — real per-language brand logos for track icons
  (`SiJavascript`, `SiPython`, `SiHtml5`, `SiCss`), used instead of generic lucide shapes so new
  language/framework tracks (C#, PHP, React, ...) get authentic logos too
- Auth.js v5 (`next-auth@beta`) + MongoDB Atlas (free M0 tier) — see "Accounts + database"
  below. Progress persists to the DB when signed in, to `localStorage` (`src/lib/progress-store.ts`)
  when anonymous.

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
- `tracks/` — `javascript.ts`, `python.ts`, `html.ts`, `css.ts`, each a `Track` with ordered
  `Level`s (codeLines with `{{zoneN}}` placeholders, `zones` answer key, `blocks` including
  distractors). Adding a track is mostly additive: new file + one line in `tracks/index.ts`'s
  `TRACKS` array + one line in `reference/index.ts` + an icon entry in `track-icon.tsx` — see
  "Content depth + more tracks" below for the couple of hardcoded-prose spots that also need a
  one-line update.
- `reference/` — cheatsheet content for `/docs/[track]`. JavaScript's is deep/professional
  (12 sections); Python/HTML/CSS are still baseline depth (short body + one example per
  section) — same `ReferenceSection` type, just less content authored so far.
- `faq-data.ts`, `site-pages.ts` (the sidebar/tab-bar page registry)

## Design system rules (don't break these without deciding to on purpose)

- **Palette**: VS Code Dark+ / Light+ exactly, via CSS custom properties in `globals.css`
  (`:root` = dark, `:root.light` = light — both fully defined, single source of truth: change
  one CSS var and every themed surface updates). This *is* the brand — not a generic dark mode.
  The `.light` class is applied to `document.documentElement` — not a wrapper `<div>` — since
  `:root` in CSS only ever matches the actual document root; a blocking inline script in
  `src/app/layout.tsx` sets it before first paint (reading `THEME_STORAGE_KEY` from
  `src/lib/theme-constants.ts`) to avoid a flash of the wrong theme, and `theme-context.tsx`'s
  `toggleTheme` keeps the class, React state, and `localStorage` in sync. (Note:
  `THEME_STORAGE_KEY` deliberately lives in its own plain file, not in the `"use client"`
  `theme-context.tsx` — importing a plain constant from a client-directive file into a Server
  Component resolved as `undefined` at runtime, a real bug hit once already.)
- **Type**: JetBrains Mono only (weights 400/500/700), used for both display headlines and body
  copy — deliberate, not an oversight. `.text-display` utility class = bold + tight tracking.
  Ligatures are force-disabled site-wide (`font-variant-ligatures: none` +
  `font-feature-settings: "liga" 0, "calt" 0` on `body`) — JetBrains Mono otherwise merges
  sequences like `>=`, `<=`, `!=`, `===` into single glyphs, which is actively misleading in a
  tool teaching people what characters to actually type.
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

- `@react-three/drei` is an unused dependency — remove next time deps are touched.
- HTML track has 5 levels, CSS has 6, JS/Python have 5 each — fine as a starter set, room to grow.
- Python/HTML/CSS docs are still baseline depth — only JavaScript has gotten the full
  professional rewrite so far (see "Content depth + more tracks" below). Apply the same bar to
  the others when there's time.
- C#, PHP, and framework tracks (React, ...) are planned but not started — Python was built
  first to establish the content-quality bar.

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

## Content depth, light mode, and harder gameplay (Phase 7, built)

- **Light mode actually works now.** It was fully dead before this — the CSS was complete but
  the toggle applied `.light` to the wrong element (see the theme bullet under "Design system
  rules" above for the fix).
- **Gameplay difficulty**: `src/lib/game-context.tsx` now tracks `mistakes` (increments on a
  wrong drop, resets per level) and `elapsedSeconds` (a per-level stopwatch, freezes on
  completion). Score per level is `Math.max(40, 100 - mistakes * 10)` instead of a flat 100 —
  intentionally ephemeral/per-attempt, not persisted as historical stats, so none of the
  progress-sync plumbing needed to change. Displayed in `right-panel.tsx` (timer, next to score)
  and `bottom-panel.tsx` (mistake count, in a previously-empty header spacer) — no layout
  redesign, just filled existing chrome.
- **Python track added** (`src/lib/tracks/python.ts`, `src/lib/reference/python.ts`) — same
  5-level topic progression as JavaScript (variables, functions, list-length, list
  comprehensions, conditionals) for a consistent difficulty curve across tracks.
- **JavaScript docs rewritten to real depth**: `ReferenceSection` grew from
  `{ body: string; codeExample?: string }` to `{ body: string[]; examples?: ReferenceExample[];
  tip?: string }` — multiple paragraphs, multiple labeled examples, and an optional callout per
  section. JavaScript now has 12 sections with real explanatory depth; HTML/CSS/Python were
  mechanically migrated to the new shape but not content-expanded yet (see TODO above).
- **Renamed "Code Canvas" → "Theebug"** site-wide (titles, metadata, footer, headers, FAQ,
  README) to match the actual repo/project name. Internal `localStorage` keys
  (`codecanvas:progress:v1` etc.) were deliberately left as-is — renaming them would silently
  drop existing users' saved progress for a purely cosmetic gain.
- **GitHub link wired up**: `SiteTopBar`'s GitHub icon now points to
  https://github.com/Gladiarn instead of the `#` placeholder.

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
