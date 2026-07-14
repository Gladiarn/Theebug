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

## Implementation order — what's next, and why in this sequence

Everything through Phase 8 (accounts/database, gameplay, tracks, docs depth, reward system,
logo, mascot, loaders) is **built and shipped**. Backend + database already exist — this
section is about the *new*, not-yet-built backlog (rate limiting, admin panel/CMS, production
readiness, roadmap features), which isn't one flat list — a few independent tracks each have
their own internal ordering. Recommended sequence, reasoning included so this can be
re-prioritized without losing the "why":

1. ~~**Error boundaries + CI**~~ **Done** (see `## Production readiness`, items 1 and 4, for
   what was actually built and what was found along the way).
2. ~~**Timer bug fix.**~~ **Done** (see `## Known bugs`).
3. **Rate limiting middleware** (Upstash + `@upstash/ratelimit`, designed in `## Security`).
   Early, because the admin panel below adds a whole new `/api/admin/*` surface — better to have
   the rate-limiting pattern already proven on the existing small API surface than to retrofit it
   later across a bigger one.
4. **Error tracking (Sentry).** Cheap, and matters more *before* a big change (the CMS
   migration below) than after — the point is catching regressions in production automatically,
   not just going forward from whenever it's installed.
5. **Testing (Vitest + Playwright), at least for what already exists.** Before the CMS work
   specifically, because that phase touches real risk surface (the scoring formula, the
   localStorage/DB merge logic, the leaderboard aggregation) — tests written against today's
   known-good behavior are what make that migration safely verifiable instead of "looks right."
6. **Admin panel / CMS** (own multi-phase effort, detailed under `## Admin panel / CMS` above).
   This is where "backend and database first" is *already* the literal plan, not a question:
   its own internal order is admin auth → **DB collections + migration script + swap reads to
   Mongo, shipped and proven alone** → *then* the admin CRUD UI (writes) → validation/safety →
   extend to more content types. Reads-from-DB has to be stable on its own before any admin
   form can safely write to it.
7. **SEO files, analytics, privacy policy.** Low effort, no dependencies on anything else —
   can slot in anytime, including interleaved with the above rather than strictly after.
8. **Accessibility fixes, backups/uptime monitoring.** Lower urgency (see reasoning in
   `## Production readiness`), trail behind the higher-risk/higher-leverage items above.
9. **Roadmap feature ideas** (badges, per-track leaderboards, hint system, more tracks, contact
   form, etc.) — opportunistic, pick based on interest. Several genuinely get *easier* once the
   CMS content model and a real test suite exist (e.g. badges/achievements are a read-only view
   over data the CMS will already be managing), so there's a real (not just risk-driven) reason
   they trail the items above rather than being pulled forward.

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
- **No emoji on site pages.** Icons are `lucide-react` only, *except* `Terminal`'s ✓/✗ (system-log
  symbols, not a character). **`RightPanel`'s worm faces are no longer an exception** — they used
  to be raw emoji (🐛/😔/🎉); as of the mascot work below they're the real `WormMascot` SVG
  component, so the emoji carve-out for this spot no longer applies.
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
- **Standing principle for all future UI work** (explicit user instruction, not a one-off): the
  user loves the current landing page and overall design — new UI must stay visually consistent
  with it, not introduce a new visual language. Concretely: reuse the existing CSS-variable
  tokens (`bg-accent`/`text-accent`/`border-border`/`bg-panel`/etc., never a hardcoded hex);
  reuse existing card/row/border-radius conventions (`rounded-[10px]` for cards, `rounded` for
  small controls); reuse `.text-display` for headlines; keep the "consistent accent color"
  discipline the theme system is built around — one CSS var drives every themed surface, so a
  new component that hardcodes a color breaks that guarantee for both future palette tweaks and
  light/dark parity.

## Logo & branding

- **`src/components/site/logo-mark.tsx`** (`LogoMark` component) + **`public/images/logo.svg`**
  (standalone file copy) + **`src/app/icon.svg`** (Next.js's file-convention favicon — auto-wired
  into `<head>`, confirmed as its own `○ /icon.svg` route in `next build` output). All three are
  the same artwork: a self-contained rounded-square badge (fixed dark tile background, not
  theme-reactive) depicting a small 3-segment worm/bug — a simplified 2D nod to the existing 3D
  "Debug the Worm" hero mascot, not an unrelated new character — with code-bracket-like curled
  antennae. Fixed colors (`#1e1e1e` tile, `#4ec9b0` mark) rather than CSS vars, deliberately: a
  favicon/app-icon needs to read correctly regardless of page theme or surrounding context (GitHub
  READMEs, social previews, browser tab chrome), so it carries its own background rather than
  relying on `--accent`, which itself differs between the dark (`#4ec9b0`) and light (`#007acc`)
  palettes.
- Wired into `SiteTopBar` (replacing the generic `lucide-react` `Bug` icon in the logo/home-link
  slot) — verified visually in both themes via screenshot, reads clearly at nav size (20px) in
  both.
- **Update**: `MenuBar`'s top-left icon (the game shell's header, i.e. the small header on
  `/play/*` pages) was originally the literal VS Code four-square logo, deliberately left alone
  as an intentional homage — noted as such right here. The user later explicitly asked for it to
  use "our logo" instead, so it's now `LogoMark` too (`h-4 w-4`, 16px), same as `SiteTopBar`.
  Verified in both themes via screenshot. The VS Code homage is gone from this spot; the app's
  overall VS Code-styled chrome (sidebar, tabs, status bar) is unaffected.

### Mascot system (`WormMascot`) — replaces the emoji-based worm faces

**`src/components/game/worm-mascot.tsx`** — a single, reusable SVG React component,
`<WormMascot mood={...} className={...} />`, exported alongside a `MascotMood` type
(`WormMood | "proud"` — a superset of the gameplay mood union, since not every place this gets
used is gameplay: "proud" is presentation-only, used on the landing page). Same segmented-body +
curled-antennae visual language as the logo, but drawn full-size and expressive (this one *is*
theme-reactive — `fill-accent`/`stroke-accent` classes, unlike the fixed-color logo/favicon,
since it only ever appears inside the themed app UI, never in a theme-less context like a
favicon). Four expressions built so far:

- **neutral** — small dot eyes, flat closed mouth.
- **happy** — open upward smile.
- **sad** — angled eyebrows + downturned mouth, *and* a bowed posture: the whole head (antennae
  + skull + face, grouped and moved together via `headTransform()`) is translated down and
  rotated, reading as a disappointed hung-head slouch rather than just a sad face on a straight
  body.
- **celebrating** — raised antennae with sparkle tips, wide open cheering mouth, *and* a zigzag
  body: the mid-segment shifts left while the head-group shifts right and rotates, so the three
  body segments form a visible S-curve/wiggle even in a static frame — pairs with the existing
  `.worm-celebrating` glow/wiggle CSS animation (unchanged) rather than replacing it.
- **proud** (presentation-only) — crossed arms, tall straight antennae, half-closed asymmetric
  eyes, one-sided smirk. Built specifically for the landing page's "meet your coach" section.

Replaced emoji in three places:
- **`RightPanel`'s `WormCharacter`** (`src/components/game/right-panel.tsx`) — was raw
  🐛/😔/🎉 emoji keyed by `WormMood`, now renders `<WormMascot mood={mood} />` inside the same
  `MOOD_ANIM` wrapper div (the existing `worm-happy`/`worm-sad`/`worm-celebrating` CSS animation
  classes are untouched, just now animating an SVG instead of emoji text). This is also why the
  "no emoji" design rule above got tightened — this was its last standing exception.
- **Landing page's "meet your coach" section** (`src/components/landing-page.tsx`) — the large
  portrait was a generic `lucide-react` `Bug` outline icon (not our mascot at all); now
  `<WormMascot mood="proud" />`. The small mood-preview row below it (`MOODS` array) was generic
  `Frown`/`Bug`/`PartyPopper` lucide icons; now small `WormMascot` renders in the matching mood
  (sad/neutral/celebrating). The three example chat bubbles' small icons were also generic `Bug`;
  now mood-matched per bubble's tone (neutral instruction → neutral, correct-answer example →
  happy, wrong-answer example → sad).
- Verified visually via screenshot in both themes — colors track `--accent` automatically (teal
  in dark, blue in light), no hardcoded colors introduced.

## Loading states / skeletons

- **`src/components/site/skeleton.tsx`** (`Skeleton`) — the one shared primitive: a
  `bg-border` + `animate-pulse` block, `className`/`style` passthrough. Every skeleton in the
  app composes this rather than each screen inventing its own pulse styling, so a future palette
  change updates every loading state at once (same "one token, everywhere" discipline as the
  rest of the design system).
- **`src/app/(site)/leaderboard/loading.tsx`** and **`src/app/(site)/account/loading.tsx`** —
  Next.js App Router `loading.tsx` convention (automatic Suspense fallback while the page's
  `async` Server Component awaits data — no manual wiring beyond the file existing at the same
  path as `page.tsx`). Both are shaped to match their real content exactly (row count, avatar
  circle, bar widths) rather than a generic spinner, per standard skeleton-UI practice. Verified
  the fallback markup is genuinely present in the server's streamed HTML via a raw `curl` check
  (not just a screenshot, since local MongoDB queries resolve too fast to reliably catch the
  fallback in a browser screenshot — the mechanism is confirmed correct either way).
- **`AuthWidget`'s** `status === "loading"` branch now renders `<Skeleton>` instead of a bare
  static div — same visual result, now sharing the common primitive.
- **Deliberately not added**: a `loading.tsx` for `/play/[track]/[level]`. That route already has
  a documented instant-shell-then-hydrate pattern (`game-context.tsx`'s progress-hydration
  effect, see "Accounts + database" above) with an already-accepted one-frame flash tradeoff — a
  skeleton there would be redundant with a mechanism that already exists and works.
- Not yet extended to `/docs/[track]` or `/learn/[track]` — both are statically generated
  (`generateStaticParams`), so they don't have a loading state to fill; only genuinely
  dynamic/data-fetching routes need one.

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

## API routes

All under `src/app/api/`, all backed by `auth()` from `auth.ts` — every route starts with
`const session = await auth(); if (!session?.user?.id) return 401`, so the user id is always
derived from the server-verified session, never trusted from the client payload.

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | Auth.js's own sign-in/callback/sign-out handlers |
| `/api/progress` | GET | Fetch the signed-in user's progress for every track |
| `/api/progress` | POST | Upsert one track's progress (validates `trackId` against the real track registry and every `TrackProgress` field's type before writing) |
| `/api/progress/sync` | POST | One-time migration: merge a browser's localStorage progress into the DB on first sign-in, keeping the higher score per track |
| `/api/account/leaderboard-opt-in` | POST | Toggle the signed-in user's `leaderboardOptIn` flag |

None of these use a schema-validation library (Zod, etc.) — validation is manual shape/type
checks, fine while the API surface stays this small. Worth reconsidering if it grows.

## Leaderboard system

`getLeaderboard()` in `src/lib/progress-db.ts` is a single MongoDB aggregation over the
`progress` collection (one document per user+track): groups by `userId` summing `score` across
all tracks and counting total completed levels, `$lookup`s into `users` to pull `name`/`image`
**and filter to only `leaderboardOptIn: true` users** (the join itself is the privacy filter —
non-opted-in users' progress docs get dropped by the subsequent `$unwind`), sorts descending by
total score, limits to 50.

- **Global only, across all tracks combined** — not per-track yet (see Roadmap).
- **Opt-in, off by default.** New users have no `leaderboardOptIn` field set (falsy), so they're
  excluded until they toggle it on via `/account` (`LeaderboardOptInToggle` →
  `/api/account/leaderboard-opt-in`). Only the display name/avatar GitHub already makes public
  on the person's own GitHub profile is ever shown — no email, no GitHub username/handle exposed.
- `/leaderboard` is `export const dynamic = "force-dynamic"` so rankings are always live — no
  caching, so every page load re-runs the real aggregation. Fine at current traffic/M0-tier
  scale; would need caching (e.g. a short `revalidate` window) if traffic ever grows.

## Security

- **Auth**: GitHub OAuth only, via Auth.js v5, `session: { strategy: "database" }` — sessions
  are looked up server-side against MongoDB on every request (not a client-decodable JWT), so a
  leaked session cookie doesn't expose any session payload, and sessions can be revoked
  server-side if ever needed (delete the session doc).
- **The `JWT_SECRET` env var name is a naming trap, worth being explicit about**: despite the
  name, this app does **not** use JWT-based sessions — that's the `session: { strategy: "database" }`
  line above. `JWT_SECRET` is passed as Auth.js's `secret` option, which it still uses for other
  internal signing (CSRF tokens, the OAuth state/nonce cookie during the GitHub handshake) even
  under the database strategy. It's named `JWT_SECRET` only because that was already the name in
  this project's `.env.local` before Auth.js was wired up, not because it reflects how sessions
  actually work. If this project ever adds a second auth provider that needs JWT sessions (e.g. a
  mobile app or third-party API client that can't hold a database-session cookie), that would be
  a real strategy change, not just a rename.
- **Session lifetime**: not customized — Auth.js's defaults apply (30-day session, refreshed on
  activity). No `session.maxAge` override in `auth.ts`. Fine for a low-stakes educational tool;
  revisit if this ever needs a shorter forced-reauth window.
- **CSRF**: handled internally by Auth.js for its own sign-in/callback flow (double-submit
  cookie) — this is why sign-in only works via a real POST from the rendered form, not a bare
  GET (this produced a confusing false-positive "Configuration" error during Phase 6 testing,
  since documented — see the plan-mode file's error log for the full root-cause trace).
- **Input validation**: every custom POST route manually checks the JSON body's shape/types
  before writing to MongoDB (see "API routes" above) — prevents arbitrary-shaped documents
  landing in the `progress` collection.
- **Secrets**: `MONGO_URI` / `JWT_SECRET` / `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` live in
  `.env.local` (gitignored) locally and as **encrypted** Vercel env vars in production (confirmed
  via `vercel env ls --scope gladiarns-projects`). Never committed; `.env.example` holds
  placeholders only.
- **MongoDB Atlas network access**: access is credential-based (`MONGO_URI` has a
  username/password baked in), not IP-allowlisted — Atlas needs "allow access from anywhere"
  (`0.0.0.0/0`) configured in its Network Access settings since Vercel's serverless functions
  don't have a static outbound IP. Worth confirming this is actually set in the Atlas dashboard —
  a locked-down allowlist would silently break production while local dev kept working fine.
- **Leaderboard privacy**: opt-in by default, see "Leaderboard system" above.

### Rate limiting middleware (planned, designed below — not yet implemented)

An in-memory counter (a plain `Map` in a route handler) does **not** work correctly on Vercel:
serverless functions are stateless and multi-instance/multi-region, so each instance has its
own memory — a client can bypass any in-memory limit just by landing on a different instance,
and every cold start resets the count anyway. Rate limiting needs a shared store. Design:

- **Store**: Upstash Redis, free tier (10,000 commands/day — a rate-limit check costs ~1-2
  commands, so this comfortably covers real personal-project traffic). First-party Vercel
  Marketplace integration, so provisioning it auto-populates `UPSTASH_REDIS_REST_URL` /
  `UPSTASH_REDIS_REST_TOKEN` as env vars — no manual credential wiring. It's REST/HTTP-based
  (`@upstash/redis`), not a persistent TCP connection, which is what makes it viable from
  serverless/edge functions at all (a normal Redis client like `ioredis` isn't).
- **Library**: `@upstash/ratelimit` — purpose-built on top of Upstash Redis, sliding-window
  algorithm (smoother than fixed-window, no "burst at the window boundary" exploit).
- **Where it runs**: `middleware.ts` at the repo root, scoped via `config.matcher` to
  `/api/:path*` only — never runs on page routes, so it adds zero latency to normal
  static/dynamic page navigation. Running it in middleware (rather than inside each route
  handler) means a limited request gets a 429 before ever reaching the route/MongoDB — cheaper
  and more consistent than duplicating the check in every handler.
- **Runtime note**: middleware historically had to run on the Edge runtime, where the native
  `mongodb` driver (used by `session: { strategy: "database" }` in `auth.ts`) doesn't work — but
  Vercel middleware now supports full Node.js via Fluid Compute, so `middleware.ts` can safely
  call `auth()` directly to get the session for keying the limiter (see below). No edge-specific
  workaround needed.
- **Keying strategy**: authenticated routes (`/api/progress`, `/api/progress/sync`,
  `/api/account/leaderboard-opt-in`) key the limiter by `session.user.id`, not IP — a signed-in
  user's own limit should follow them, not their network. A conservative starting budget: 30
  requests/60s sliding window per user for `/api/progress` POST (normal play never fires this
  faster than once per level completion), tighter for `/api/account/leaderboard-opt-in` (a
  toggle, rarely clicked repeatedly). Unauthenticated requests to these routes already 401
  before ever touching MongoDB, so IP-keying isn't needed there.
- **Response contract**: a limited request gets `429` + JSON `{ error: "Too many requests" }` +
  a `Retry-After` header (seconds until the window resets). Every response (limited or not) also
  gets `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset` headers, so any future
  client code can react gracefully instead of just seeing an opaque failure.
- **Fail-open, not fail-closed**: if Upstash is unreachable or errors, the middleware lets the
  request through rather than blocking all traffic — a rate-limiter outage taking down the whole
  app would be a worse outcome than temporarily having no rate limiting, at this project's scale.
  Log the failure (see Observability in the "Production readiness" section below) so an outage
  is at least visible.
- **New env vars**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (Production + Preview +
  Development, unlike the current OAuth/Mongo vars which are Production-only — rate limiting
  should work in preview deploys too since it needs no OAuth callback URL).

## Deployment (Vercel)

- Project **`theebug`** under the **`gladiarns-projects`** team (Hobby plan). **Hard
  constraint, confirmed by the user: never run Vercel commands under any other scope** — the
  same account also has a `kpve` team with live client production apps.
- Production domain: **https://theebug.vercel.app**. Framework preset: Next.js (Turbopack,
  auto-detected `next build`).
- **Env vars are currently Production-only** (confirmed via `vercel env ls`) — Preview and
  Development deployments have none of the four secrets. `/play/*` still works on a preview
  deploy (no DB needed for anonymous play), but sign-in and progress sync would fail there.
- **Two separate GitHub OAuth Apps** exist because classic OAuth Apps support exactly one
  callback URL each: "Theebug" (local dev, `http://localhost:3000/api/auth/callback/github`)
  and "Theebug (Production)" (`https://theebug.vercel.app/api/auth/callback/github`). If preview
  deploys ever need working sign-in, this is the blocker to solve first — Vercel's per-branch
  preview URLs don't have a clean single callback URL to register.
- Deploys are currently manual (`vercel --prod --scope gladiarns-projects` or equivalent) — no
  CI/CD auto-deploy-on-push has been set up/confirmed.

## Environment variables

| Variable | Purpose | Notes |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...`; must include the db path segment, not a query param |
| `JWT_SECRET` | Auth.js session-cookie signing secret | Generate via `openssl rand -base64 32`; named to match what was already in `.env.local` rather than Auth.js's own default `AUTH_SECRET` |
| `AUTH_GITHUB_ID` | GitHub OAuth App client ID | Different value for the local app vs. the production app |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App client secret | Same caveat as above |

Template: `.env.example` (repo root, committed, placeholders only). Real values live in
`.env.local` (gitignored) and in Vercel's encrypted env var store (Production only, see above).

## Production readiness — professional website checklist

A senior-dev-style audit of what separates "a well-designed personal project" (current state)
from "a professional, production-grade website." Confirmed by directly checking the repo — no
guessing. **Error boundaries and CI are now built** (items 1 and 4 below); still open: **zero
automated tests, no sitemap/robots.txt, no analytics, no error tracking, and no privacy/terms
pages.** None of this is a criticism of what's been built — the design system, game mechanic,
and content depth are all genuinely strong — it's the "everything around the product" layer
that a real launch needs and a fast-moving build phase reasonably defers. Ordered roughly by
priority (risk/impact if skipped, not effort):

1. ~~**Error boundaries.**~~ **Done.** `src/app/error.tsx` (route-segment errors) and
   `src/app/global-error.tsx` (root-layout errors) built. `error.tsx` reuses `not-found.tsx`'s
   exact layout and now also uses `WormMascot mood="sad"` (not-found.tsx was upgraded to match,
   swapping its old generic `lucide-react` `Frown` icon for the same mascot — one consistent
   "Debug is confused" treatment across every exception-state page). `global-error.tsx` is
   deliberately different: it replaces the **entire root layout** when that layout itself
   throws, so it can't safely depend on `ThemeProvider`, fonts, or any app component that might
   itself be broken — it's self-contained with inline styles and hardcoded dark-theme colors,
   and uses a 🐛 emoji instead of `WormMascot` for the same reason (minimize what it depends on).
   This is a deliberate, documented exception to the "no emoji" design rule — resilience over
   brand consistency for the one page whose entire job is "still work when something is very
   wrong." Verified both by triggering a real error via a scratch test route in a live browser
   (not just curl — dev-mode SSR/CSR differences meant curl wasn't representative) and by
   checking Next.js's own route manifest, which lists both as registered `error`/`global-error`
   boundaries.
2. **Error tracking / observability.** Today the only way to see a production error is manually
   running `vercel logs` after the fact — no proactive alerting. Recommend **Sentry**'s free
   tier (5,000 errors/month, plenty at this scale) via `@sentry/nextjs` — a few minutes to wire
   up, and it's what turns "a user emailed me it's broken" into "I got paged before they
   noticed." Pairs with the rate-limiter's fail-open logging above.
3. **Testing.** ~~Zero automated tests~~ **Vitest unit tests done** (8 tests, wired into CI as a
   `Test` step before `Build`). Pulled the two pieces of pure logic plan.md had flagged as
   easy-to-silently-break out into standalone, dependency-free functions so they're actually
   testable:
   - `calculateLevelScore` (`src/lib/scoring.ts`) — was inline in `game-context.tsx`'s
     `dropBlock`. Tests cover the perfect-run case, per-mistake deduction, the 40-point floor,
     and that it never goes negative.
   - `pickHigherScoreProgress` (`src/lib/progress-merge.ts`, new file, not left inside
     `progress-db.ts`) — the "never regress a user's server-side score" decision from
     `mergeLocalProgress`. Had to live in its own file specifically because `progress-db.ts`
     has `import "server-only"` at the top, which risks breaking under Vitest's plain-Node test
     runner (no Next.js bundler involved) — separating pure logic from `server-only`-marked I/O
     code turned out to be required for testability, not just nice-to-have. Tests cover: no
     existing progress yet, local wins, server wins (regression prevention — the actual point of
     this function), and a tie (server wins, local must *strictly* exceed).
   - ~~Playwright E2E suite~~ **Done.** `@playwright/test` + `playwright.config.ts`
     (`webServer` auto-builds and starts the app; `reuseExistingServer` locally so it reuses
     the dev server instead of rebuilding). `e2e/level-complete.spec.ts` — 3 tests: complete a
     level cleanly (reward modal shows, `+100`/3-star full score, Next Level navigates and the
     modal closes), a level completed with one mistake (`+90`, confirms the scoring/star
     deduction path — not just the happy path), and the mascot-based not-found page for an
     unknown route. Wired into CI as its own `e2e` job (separate from `build`, since it needs
     Playwright's browser binaries installed via `playwright install --with-deps chromium` and
     a running server) — uploads the HTML report as a CI artifact on failure for debugging.
   - **Still not done**: `getLeaderboard`'s aggregation shape (a real MongoDB pipeline — a
     meaningful test needs a real or mocked DB, a shallow "does this array look right" test
     wouldn't add real confidence, skipped rather than writing a low-value test to check a box)
     and any E2E coverage of authenticated flows (sign-in, leaderboard opt-in) — GitHub OAuth
     isn't something to script through in an E2E test without investing in session-mocking
     infrastructure, which wasn't picked up in this pass.
4. ~~**CI (GitHub Actions).**~~ **Done.** `.github/workflows/ci.yml` — runs on every PR into
   `main` and every push to `main`: `npm ci` → `tsc --noEmit` → `eslint .` → `npm run build`.
   **Real finding while building this**: `npm run build` was tested directly (temporarily
   renaming `.env.local` away) and confirmed to genuinely fail without `MONGO_URI` — Next.js
   imports every API route module during its "collecting page data" build phase, and
   `src/lib/mongodb.ts` throws eagerly at module-evaluation time if `MONGO_URI` is unset (`if
   (!uri) throw new Error(...)`), independent of whether the route is statically or dynamically
   rendered. Then tested again with obviously-fake placeholder values
   (`mongodb+srv://fake:fake@fake.mongodb.net/...`, fake OAuth IDs) and confirmed the build
   **succeeds** — nothing actually connects to Mongo or GitHub at build time, only a non-empty
   string is required. So the workflow hardcodes clearly-fake placeholder values directly in the
   YAML (commented as such) rather than needing real secrets configured in GitHub — simpler, and
   makes it obvious to anyone reading the workflow that these aren't real credentials. The test
   suite from item 3 above isn't in the workflow yet since it doesn't exist yet.
5. ~~**SEO fundamentals.**~~ **Done.** `src/app/sitemap.ts` and `src/app/robots.ts` (Next.js file
   conventions — confirmed rendering correctly at `/sitemap.xml` and `/robots.txt`, and listed as
   their own routes in `next build` output). Sitemap covers the static marketing pages plus a
   `/learn/[track]` and `/docs/[track]` entry per non-`comingSoon` track (generated from `TRACKS`,
   not hand-listed, so new tracks are picked up automatically) — deliberately **excludes**
   individual `/play/[track]/[level]` pages (too granular/thin-content for SEO value, and the
   level count shifts over time) and `/account` (private). `robots.txt` disallows `/account` and
   `/api/`. Also added `robots: { index: false, follow: false }` to `/account`'s own `metadata`
   export, belt-and-suspenders with the `robots.txt` disallow, since it's user-specific data that
   shouldn't be indexed either way.
6. **Accessibility.** Two concrete gaps were named rather than a vague "do an a11y pass" —
   one is fixed, one is a real product decision, not a quick fix:
   - ~~`LevelCompleteModal` has no focus trap...~~ **Fixed.** Focus now moves into the dialog on
     open and back to whatever had focus before it on close; Tab/Shift+Tab cycle within the
     dialog's focusable elements only (never escape into the page behind it); Escape dismisses.
     Manual implementation (no new dependency — `querySelectorAll` for focusable elements plus a
     `keydown` listener), consistent with the rest of the app not reaching for heavy UI
     libraries. Verified live via Playwright: confirmed focus lands on the dialog itself on open,
     Tab cycles Close → Review level → Next Level → wraps back to Close (never leaves), and
     Escape closes it.
   - **Still open, and still a real product decision, not a quick fix**: the core game mechanic
     (`react-dnd-html5-backend`) is mouse/touch-only by construction — there's no keyboard path
     to complete a level at all. A real fix is non-trivial (would need a parallel
     keyboard-operable selection mode for drop zones) — accept as a known limitation vs. invest
     in it is a call for the user to make, not something to silently build around.
7. ~~**Analytics.**~~ **Code done, one manual step left.** `@vercel/analytics` installed,
   `<Analytics />` added to `src/app/layout.tsx`. **Needs a one-click toggle in the Vercel
   dashboard** (Project → Analytics tab → Enable) to actually start collecting — this isn't
   CLI-scriptable (checked: no `vercel analytics` subcommand, nothing in `vercel project
   inspect`'s output), so it's a manual step for whoever has dashboard access. The component
   ships beacons regardless; they're just silently ignored until the feature is switched on.
8. ~~**Legal: Privacy Policy.**~~ **Done.** `src/app/(site)/privacy/page.tsx`, same pattern as
   `/about`/`/faq`. Covers what's collected (GitHub profile info via OAuth, level progress),
   the leaderboard's opt-in/off-by-default model, that nothing is sold/shared beyond GitHub
   (auth) and MongoDB Atlas (storage), the single Auth.js session cookie, and a manual
   data-deletion path (email, since there's no self-serve account-deletion UI yet). Registered
   in `site-pages.ts` (so the tab-bar/sidebar/status-bar breadcrumb system — which is driven by
   `findSitePage()` matching against that registry — renders correctly instead of silently
   falling back to "Home"), linked from the footer's "company" group, and added to
   `sitemap.ts`. A Terms of Service was intentionally skipped — lower priority for a free
   educational tool with no payments/contracts.
9. **Backups / disaster recovery.** MongoDB Atlas's **M0 free tier does not include automated
   backups** (that's a paid-tier feature) — if the cluster were ever deleted or corrupted,
   there is currently no way to restore user progress. Worth an explicit decision: accept the
   risk (low-stakes data, a free personal project) vs. a scheduled `mongodump` export (would
   need somewhere free to store the dump — e.g. a scheduled GitHub Action pushing an encrypted
   export to a private repo or Backblaze B2's free tier).
10. **Uptime monitoring.** Nothing currently alerts if `theebug.vercel.app` goes down (Vercel
    itself is reliable, but MongoDB Atlas or a bad deploy could still take the app down without
    anyone noticing). **UptimeRobot**'s free tier (50 monitors, 5-minute checks) covers this in
    a few minutes of setup.
11. **Font loading** — checked, already done right: JetBrains Mono is loaded via
    `next/font/google` in `layout.tsx`, which self-hosts and subsets the font at build time (no
    external request, no layout shift). No action needed here — listed to confirm it was
    checked, not skipped.

None of this needs to happen before the site is "good enough to share" — it's already there.
This is the gap between that and "a professional site an experienced dev would sign off on
running for real users." Recommend tackling in roughly this order: **error boundaries → CI →
rate limiting (already designed above) → error tracking → SEO files → analytics → privacy
policy → testing → accessibility → backups/uptime**, front-loading the highest-risk/lowest-effort
items first.

## Performance audit

Measured, not guessed: built the app for production (`next build` + `next start`) and used a
real Playwright network audit (every JS/CSS response's actual byte size, not dev-server
estimates — Turbopack's dev bundles are unminified and split completely differently, so a dev
audit would have been misleading) across `/`, `/play/[track]/[level]`, `/docs/[track]`, and
`/leaderboard`.

**Found and fixed — the dominant issue, a classic Next.js gotcha.** Every single page was
shipping **~1.5-1.7MB of JS**, and 877KB of that (roughly half) was `three.js` +
`@react-three/fiber` — used by exactly one component, `DebugWormScene`, which only ever renders
in one place: the landing page's hero. `landing-page.tsx` imported it with a plain top-level
`import`, which is the trap: Next.js's automatic per-route code-splitting doesn't reliably keep
a heavy dependency out of the shared/vendor bundle just because only one page happens to use it
— without an explicit code-split boundary, bundlers commonly fold "big enough" dependencies into
a common chunk loaded on every route regardless. Confirmed precisely via `grep`ing the actual
chunk file for `TubeGeometry`/`CatmullRomCurve3`/`WebGLRenderer` (`DebugWormScene`'s own symbols)
and finding that exact chunk requested on `/play/*`, `/docs/*`, and `/leaderboard` too, despite
the 3D scene never rendering on any of them.

**Fix**: `landing-page.tsx` now imports `DebugWormScene` via `next/dynamic(..., { ssr: false })`
instead of a plain `import`, forcing Turbopack to actually treat it as a separate, lazily-fetched
chunk. `ssr: false` is correct here regardless of the bundle-size issue — it's a WebGL canvas,
there's nothing meaningful to server-render. Re-measured after the fix:

| Route | Before | After |
|---|---|---|
| `/` | 1567KB | 642KB |
| `/play/javascript/1` | 1673KB | 702KB |
| `/docs/javascript` | 1603KB | 678KB |
| `/leaderboard` | 1567KB | 636KB |

Roughly **1MB removed from every route except the homepage**, and even the homepage itself
dropped, since the 3D scene now loads lazily instead of blocking on the initial bundle. Verified
the 3D worm still renders correctly post-fix (canvas present, tube geometry visible, screenshotted)
— this was a pure bundling fix, no visual/behavioral change.

**Checked and ruled out as non-issues**: no `backdrop-blur`/`backdrop-filter` usage anywhere in
`src` (the one earlier instance, the reward modal's overlay, was already removed — see Phase 8's
history); the one `<img>`-looking match outside `next/image` is a string literal inside
`live-diff-hero.tsx`'s example-code mockup data, never actually rendered as an image element;
the next-largest chunk (227KB, present on every route as expected) is React/ReactDOM itself —
normal, unavoidable framework baseline, not app-specific bloat worth chasing.

**Found, understood, deliberately not fixed this pass — a real architectural cost, not a quick
fix.** `game-context.tsx`'s `GameContext.Provider` passes one large inline object literal
(`zoneFills`, `score`, `completedLevels`, `wormMood`, `wormMessage`, `terminalLogs`,
`levelComplete`, `mistakes`, `elapsedSeconds`, `justCompleted`, `lastLevelPoints`, plus every
action function) as its `value`, consumed by **9 different components**
(`MenuBar`, `Terminal`, `DropZone`, `Sidebar`, `LevelCompleteModal`, `SignInNudge`,
`EditorArea`, `RightPanel`, `BottomPanel`). Because it's a new object literal on every render
and nothing is memoized, **every one of those 9 consumers re-renders on every state change** —
including the once-per-second `elapsedSeconds` tick, meaning the entire game UI tree re-renders
every second during active play, whether or not a given component displays the timer.
`useMemo`-wrapping the value object would **not** actually fix this, since `elapsedSeconds`
would still need to be a dependency and still changes every second — the real fix is
structural: splitting the frequently-changing, display-only fields (`elapsedSeconds`, and
likely `terminalLogs`) into their own narrower context(s) that only their actual consumers
(`RightPanel` for the timer, `Terminal` for logs, `LevelCompleteModal` needing the *final*
elapsed value at completion) subscribe to. Not fixed this pass because: (1) it's a real
refactor of the most heavily-used file in the app, not a quick change, and deserves dedicated
testing bandwidth rather than being squeezed into a "check performance" pass; (2) without a
profiling trace showing actual dropped frames, this is a real *waste* (unnecessary re-renders)
but not confirmed as *visible jank* — simple text/small-SVG components re-render fast enough on
modern hardware that this may be more "technically wasteful" than "perceptibly laggy". Flagging
precisely so it's a deliberate, understood scope decision, not a silent gap.

## Admin panel / CMS (planned — not started, design notes so we build toward it)

Motivation: today, adding a track, a level, or a docs section means editing a TypeScript file
(`src/lib/tracks/*.ts`, `src/lib/reference/*.ts`) and redeploying. That's fine for the current
build phase but doesn't scale to "add a challenge on a whim" — the goal is a `/admin` area
where tracks, levels/challenges, and docs content can be created/edited without touching code.
This is a genuinely big, multi-stage piece of work — noted here so current and future work
keeps the door open for it rather than accidentally closing it off.

### The core architectural shift this requires

Content currently lives as **imported static data** (`TRACKS`/`REFERENCES` arrays built at
module-load time from hardcoded TS objects). An admin panel needs content to be **queryable and
writable at runtime**, which means it has to move into MongoDB (already in place, no new
infra) as real collections — `tracks`, `levels`, `docSections` (or similar) — with the admin UI
doing normal CRUD against them via API routes, the same pattern already established for
`progress`/`users`.

**The good news, confirmed while reviewing this for the plan**: the existing type shapes
(`Track`, `Level`, `LevelConcept` in `src/lib/tracks/types.ts`; `TrackReference`,
`ReferenceSection`, `ReferenceExample` in `src/lib/reference/types.ts`) are already flat,
JSON-serializable data with no functions or non-serializable values — they can become MongoDB
document shapes almost as-is, no redesign needed. And every read already goes through a lookup
function (`getTrack(id)`, `getReference(trackId)`, `getLevelIndexById(...)`) rather than
components importing `TRACKS`/`REFERENCES` directly all over the codebase — that's exactly the
abstraction seam needed. **Principle to keep following as more content types get added**: any
new content (FAQ entries, future challenge types, etc.) should stay flat/serializable and be
read through a lookup function, never imported as a raw constant into components — that's what
makes swapping "reads from a TS file" for "reads from MongoDB" a change in one place later,
not a site-wide rewrite.

### Proposed phasing (own multi-phase effort, not a single PR)

1. **Admin authentication.** Add a `role` (or `isAdmin: boolean`) field to the `users`
   collection, checked in a new `/admin` route group's layout (server-side, same pattern as the
   existing `auth()` checks in API routes) and in dedicated `/api/admin/*` routes. Nobody is an
   admin by default — the first admin flag gets set directly in the MongoDB Atlas dashboard (or
   a one-off script), not through any UI, to avoid a chicken-and-egg self-promotion bug.
2. **Data model migration, read path first.** Create the MongoDB collections, write a one-time
   seed script that imports the current `TRACKS`/`REFERENCES` static exports and writes them
   into Mongo verbatim (their shapes already match, per above). Then swap `getTrack`/
   `getReference`/etc. to query Mongo instead of the static arrays — **ship this before any
   admin UI exists**, so "reads from the DB" is proven stable on its own, decoupled from
   "writes come from an admin form." Cache the reads (content changes rarely) — Next.js 16 Cache
   Components (`use cache` + `cacheTag`/`updateTag`) fit well here: tag content by track,
   `updateTag` it whenever the future admin UI saves a change.
3. **Admin CRUD — tracks & levels/challenges.** Forms for track metadata (title, description,
   color, icon), and per-level editing (objective, `codeLines` with `{{zoneN}}` placeholders,
   `zones` answer key, `blocks` including distractors, worm narration, the `concept` recap
   added in Phase 8). **Open design question, flag for a real decision before building**: a raw
   JSON editor is far less effort and harder to get subtly wrong on the placeholder/zone
   matching, versus a fully structured form which is friendlier but a lot more UI to build —
   recommend starting with a validated JSON editor (see validation below) and upgrading specific
   fields to structured inputs later if it proves painful.
4. **Admin CRUD — docs/reference content.** Forms for `ReferenceSection`s within a track's docs
   page. **Open modeling question from "creating docs category"**: is a "category" a grouping
   *within* one track's doc page (e.g. tabs like "Basics"/"Advanced" for JavaScript's 12
   sections), or an independent content area not tied to a game track at all (more blog/wiki-like)?
   These lead to different schemas — worth deciding explicitly before this stage, not defaulting
   silently.
5. **Validation / safety net.** Since this becomes live-editable content that can break
   gameplay (e.g. a `zones` answer that doesn't match any `blocks` entry, or a `{{zoneN}}`
   placeholder with no matching zone), the admin save path should validate structural
   consistency before allowing a publish — at minimum: every `{{zoneN}}` in `codeLines` has a
   matching `zones` entry and vice versa, every `zones[].answer` exists among that level's
   `blocks`. A lightweight draft/publish distinction (save as draft, a separate "publish" action
   that runs validation) is safer than validating only on save.
6. **Extend to other content types** once the pattern is proven: FAQ entries (`faq-data.ts`
   today), and any future "challenges" concept if that ends up meaning something distinct from
   the existing level/track model rather than just more levels.

### CMS-readiness audit (checked directly in the repo, not assumed)

Re-checked every place `TRACKS`/`REFERENCES`/`FAQ` actually get consumed, to find real gaps
rather than restate the principle abstractly:

- **Real gap found**: `src/components/landing-page.tsx` and
  `src/components/site/docs-track-view.tsx` are both `"use client"` components that import the
  full `TRACKS` array directly at module scope (`landing-page.tsx` for the track grid + total
  level count; `docs-track-view.tsx` for its "other tracks" switcher list) — unlike every other
  consumer, which either calls `getTrack`/`getReference` from a Server Component or (in
  `docs-track-view.tsx`'s own case) already receives `track`/`reference` as props from its
  parent `docs/[track]/page.tsx`. A static array import is free today, but a **client** component
  cannot `await` a MongoDB query — once tracks live in the database, these two need to receive
  the track list as a **prop from their Server Component parent** instead (e.g. `app/(site)/page.tsx`
  would fetch and pass `tracks={await getAllTracks()}` into `<LandingPage tracks={tracks} />`,
  which today is rendered with no props at all). Flagging this now, precisely, so the future
  migration isn't a surprise scramble through the client-component boundary — this is the one
  real inconsistency the audit turned up.
- **Minor, not urgent**: `src/lib/faq-data.ts` exports a raw `FAQ` array with no `getFaq()`
  lookup function (unlike tracks/reference) — only one consumer today (`faq/page.tsx`, a Server
  Component), so it's not broken, just inconsistent with the established pattern. Worth adding
  a `getFaq()` wrapper whenever FAQ content is touched next, for consistency rather than urgency.
- **Explicitly out of scope for the current CMS plan**: landing-page marketing copy (`STEPS`,
  `FEATURES` arrays in `landing-page.tsx`), About/FAQ page intro prose, footer text. The user's
  original ask was specifically docs/categories/challenges — this is genuinely different content
  (changes rarely, is prose-heavy/design-coupled rather than structured data) and pulling it into
  the same admin panel would be scope creep on a plan that's already large. Noting this
  explicitly so it's a deliberate scope line, not a silent gap discovered later.
- **Confirmed still holding**: `src/lib/tracks/*.ts`, `src/lib/reference/*.ts`, and everything
  added this session (Phase 8's `concept` field, the mascot's mood configs) all stayed flat,
  serializable, and behind lookup functions — no new violations introduced while building the
  reward system, mascot, or docs work.

### What this means for work happening now

No code changes needed today for the CMS/admin-panel work itself — it's still a future phase.
Two concrete things now carried forward from this audit for whenever that phase starts: keep
treating `src/lib/tracks/*.ts` and `src/lib/reference/*.ts` as if they were already seed data for
a future database (flat, serializable, accessed only via lookup functions), and fix the
`landing-page.tsx`/`docs-track-view.tsx` direct-`TRACKS`-import gap above — as a small,
low-risk prop-passing refactor, worth doing whenever those files are touched next regardless of
CMS timing, since passing data down as props is the more idiomatic Next.js pattern anyway.

## Email (free tier option, not yet built)

No email is sent anywhere in the app today — GitHub OAuth means there's no password-reset or
email-verification flow to build. If a future feature needs it (a contact/feedback form,
track-completion digest, etc.), the recommended free option is **Resend**: 3,000 emails/month /
100/day on the free tier, the de facto standard for Vercel+Next.js projects (first-party Vercel
Marketplace integration, official `@react-email` templates for building emails with JSX), and
needs only one new env var (`RESEND_API_KEY`). Testing doesn't even require owning a domain —
Resend's shared `onboarding@resend.dev` sender works out of the box; a verified custom domain
is only needed before sending to real users at volume. Purely a recommendation — no code exists
for this yet, only build it when a concrete feature needs it.

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

## Reward system + per-level teaching recap (Phase 8, built)

Gap flagged after using the deployed Phase 7 build: completing a level just unlocked "Next
Level" with no payoff moment, and nothing reinforced *what* the level actually taught — the
site is meant to be gameplay *and* teaching, not just a puzzle with no explanation attached.

- **`Level` gained a `concept` field** (`src/lib/tracks/types.ts`): `{ summary: string; details:
  string[]; example?: string }`. Every one of the 21 levels across all four tracks now has a
  short teaching recap — not a restatement of the puzzle, but the underlying concept plus
  context that goes slightly beyond what was strictly needed to pass (e.g. JS level 1's recap
  covers `let` vs `const` vs `var`, not just "message is a string").
- **`LevelCompleteModal`** (`src/components/game/level-complete-modal.tsx`) — a reward screen
  that pops up the moment a level is freshly completed (not on revisiting an already-completed
  level). Shows a 1-3 star rating (3 = zero mistakes, 2 = up to 2 mistakes, 1 = more), the
  points/time/mistakes for that attempt, and the concept recap with a code example. "Review
  level" dismisses it in place; "Next Level" dismisses and advances. Rendered inside
  `game-play-shell.tsx` alongside the existing panels.
- **`game-context.tsx`** gained `justCompleted` (true only for a fresh completion this session,
  reset on level change/reset) and `lastLevelPoints` (the exact score awarded that attempt) plus
  `dismissReward()`. Deliberately ephemeral like `mistakes`/`elapsedSeconds` — no new persisted
  fields, no `progress-db.ts`/API changes needed.
- Verified end-to-end with a scripted Playwright run (drag-and-drop via `dragTo`, since the game
  uses `react-dnd-html5-backend` which needs real HTML5 drag events, not click simulation):
  confirmed the modal renders in both themes, stars/points scale correctly with mistakes,
  "Review level" dismisses without losing `levelComplete` state, and "Next Level" navigates.

## Known bugs

- ~~**Level timer doesn't reset on the "Reset" button (mid-level).**~~ **Fixed.** Root cause was
  `src/lib/game-context.tsx`'s ticking `useEffect` closing over `levelStartRef.current` once into
  a local `const start`, so `resetLevel()`'s direct ref mutation had no effect on the
  already-running `setInterval` (its dependencies don't change when Reset is clicked on an
  *incomplete* level). Fix applied exactly as designed: the `setInterval` callback now reads
  `levelStartRef.current` fresh on every tick instead of closing over a one-time `const`.
  Re-verified with the same Playwright repro that originally caught it: timer climbs to `0:06`,
  Reset clicked, shows `0:00`, climbs normally afterward (`0:01` after ~2.2s) instead of the old
  jump to `0:08`.

- **Fixed — a real progress-loss bug, found and fixed while building the E2E suite/sign-in
  nudge, not something anyone reported.** `score`/`completedLevels` in `game-context.tsx` start
  at their default `0`/`[]` on every fresh mount (page load, or navigating to a level in a
  different track), and only get overwritten with the real saved values by a `useEffect` that
  reads localStorage (or fetches `/api/progress` if signed in). If `dropBlock` completed a level
  **before that effect had run**, it saved `nextScore = 0 + levelScore` and
  `nextCompleted = [thisLevel]` — silently **overwriting**, not merging with, every level
  completed in earlier sessions. Caught by an E2E test that (unlike a real human) can drag a
  block within milliseconds of page load: completing JS levels 1 → 2 → 3 back-to-back left
  localStorage with only `{completedLevels: [3], score: 100}` instead of
  `{completedLevels: [1,2,3], score: 300}`. Confirmed via a standalone repro script that adding
  a 500ms wait before interacting made the bug disappear — nailing down the exact race.
  **Fix**: a new `hydrated` state, `false` until the hydration effect has actually read (or
  fetched) saved progress for the current track/auth state, reset to `false` at the start of
  every new hydration cycle. `dropBlock` now ignores drops entirely while `!hydrated` — a fresh
  no-op rather than a corrupting write. Trade-off, stated plainly: for a signed-in user, the
  `/api/progress` fetch is a real network round-trip, so there's a real (if small and
  network-dependent) window where a very fast click right after page load could be silently
  ignored rather than registered — a minor "huh, nothing happened, let me try again" UX rough
  edge, which is a far better failure mode than silently losing progress. For anonymous/
  localStorage users this window is sub-millisecond and not realistically hittable by a human.
  Re-verified: the exact repro script now shows `[1]` → `[1,2]` → `[1,2,3]` correctly
  accumulating even performing drags immediately (no artificial wait) once `hydrated` gates
  correctly; the full E2E suite (which does still wait ~150ms before each drag, matching real
  human timing, not working around the bug) passed reliably across 3 repeated full runs.
  **Not covered by an automated regression test beyond the E2E suite** — `game-context.tsx` is
  a hook-heavy client component; a true unit-level regression test would need React Testing
  Library + jsdom added to the project, which wasn't picked up in this pass since the E2E
  suite's multi-level-completion flow already exercises this exact path end-to-end.

## Roadmap ideas (not yet built — proposed, pick what's worth doing next)

Loosely ordered by how much they'd move "this is a teaching game with rewards," which is the
gap that prompted Phase 8:

1. ~~**Badges/achievements on `/account`.**~~ **Done**, with one honest scope adjustment from
   how it was originally proposed. `src/lib/badges.ts` (`computeBadges`, pure function, 6 unit
   tests) derives badges entirely from data already persisted — no new fields: "Getting
   Started" (any level done), "Polyglot" (progress in 2+ tracks), per-track "Halfway There"
   (≥50% of a track), "Track Complete" (100% of a track), and "Perfectionist" (a track finished
   with the *maximum possible* score). That last one is the adjustment: the original idea was a
   per-level "3 stars, zero mistakes" badge, but **no per-level mistake count is actually
   persisted** — only each track's summed score. Turned out to still be honestly derivable
   though: since every level's max score is 100, a track's total score equalling
   `levels.length * 100` can only happen if every level in it was completed with zero mistakes,
   so "Perfectionist" captures the same real signal without needing a new persisted field.
   Rendered on `/account` between the track-progress list and the leaderboard opt-in toggle,
   only when at least one badge is earned. Not covered by E2E (requires a real signed-in
   session, same limitation as the leaderboard opt-in flow) — relying on the unit tests + code
   review instead.
2. **Track-completion reward**, distinct from the per-level one — a bigger celebration screen
   when the *last* level of a track finishes (currently it's the same modal as any other level).
   Natural place to show total track time/score and tease the next track.
3. **HTML/CSS docs depth** — the one piece of Phase 7 explicitly deferred; JavaScript is the
   only track with the full 10+ section professional rewrite so far.
4. **Hint system with a cost** — a "Hint" button that reveals which block is correct but costs
   points (e.g. -20), giving struggling learners a way forward without breaking the
   mistake-penalty design already in place.
5. **C#, PHP tracks**, then framework tracks (React, ...) — already called out as planned in
   "Known placeholders" above; Python established the content-quality bar to match.
6. **Daily streak tracking** — would need one new persisted field (`lastPlayedDate` or similar)
   on the user's progress document; the only roadmap item here that isn't purely additive to
   existing data.
7. **Per-track leaderboards**, not just the current global one — likely the natural next step
   once there are 5-6+ tracks, so a JS beginner isn't just compared against Python veterans.
8. **Contact/feedback form**, using the Resend free tier proposed above — low effort once email
   exists at all, and gives real users a way to report bugs/typos in level content.
9. **Shareable completion cards** — an OG-image-generated card ("I finished the Python track on
   Theebug 🐛") for social sharing, using Next.js's built-in `ImageResponse`/OG image generation
   (no new service needed, ships with Next.js).
10. ~~**Sign-in nudge for anonymous players**~~ **Done**, and turned up a real bug along the
    way. `src/components/game/sign-in-nudge.tsx` — a dismissible banner shown once a signed-out
    player has completed 3+ levels total (any track), offering GitHub sign-in;
    permanently dismissible via a localStorage flag
    (`codecanvas:signin-nudge-dismissed:v1`). Re-checks on both session-status changes *and*
    `justCompleted` from `useGame()` — the second trigger was necessary, since completing a
    level updates localStorage directly without touching session status, so without it the
    nudge would only ever evaluate progress from before the current page loaded. Building the
    E2E test for this (completing 3 levels back-to-back, fast) is what surfaced the hydration
    race condition documented in `## Known bugs` above — the nudge feature itself was never
    buggy, but writing a fast automated test for it caught something a slower human never would.
11. **Docs search** — a simple client-side fuzzy search (e.g. over the existing
    `REFERENCES`/section data, no external search service needed at this content size) across
    `/docs/*` sections.
12. **A free-play code sandbox**, separate from the guided levels — lets a learner experiment
    without a fixed answer key. Vercel Sandbox (ephemeral microVMs, part of the current Vercel
    plan) is the natural fit if this ever needs to actually *execute* code rather than just
    accept/reject a drag-and-drop answer.
13. **PWA / installable + offline play** — levels are static data (`tracks/*.ts`), so
    already-loaded levels could work offline with a service worker; mostly a manifest +
    caching-strategy addition, not a data-model change.

Note: items 8-13 above are fresh suggestions (not yet discussed with the user) added in
response to "add more feature please" — pick whichever are actually wanted before starting any
of them.

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
