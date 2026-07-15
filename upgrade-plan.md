# Theebug — Upgrade Plan

A running punch list of user-tested feedback: things to change, fix, or add after using the
live site. `plan.md` (repo root) is the architecture/decision-log source of truth for how the
app is built — this file is just what's next.

Each item below should say what's wrong/wanted, why (if known), and get struck through with a
one-line summary once shipped — same pattern `plan.md` already uses for its own "Known bugs"
and roadmap sections, so history isn't lost, just marked done.

## How to use this file

1. User tests the live site (or dev build) and reports issues/requests.
2. Each report becomes one entry here — repro steps or the exact ask, plus any relevant context
   (which page, which track, screenshot if useful).
3. Entries get picked up, fixed/built, then struck through with what actually shipped —
   mirroring how `plan.md`'s "Known bugs" section is written, so this stays a real log, not
   just a TODO that silently disappears.

---

## Open items

### 1. Landing page feels thin — add more sections

~~**Shipped** — 3 of the 4 originally-proposed sections (per the decided starting order);
testimonials stayed deferred, as planned, since there's still no real learner content for them.~~

`src/components/landing-page.tsx` grew from 5 sections to 8:
- **Stats bar** (new, right after the hero): 4 honest, derivable numbers — course count, total
  level count (both computed from `TRACKS`, not hardcoded), "3" difficulty tiers, "100%" free.
  Deliberately no invented numbers (no fake learner counts) — everything shown is either computed
  from real data or a literally-true claim.
- **"Why Theebug" comparison** (new, after "how it works"): a two-column card — "Traditional
  tutorials" (✗, muted) vs. "Theebug" (✓, accent-bordered with a glow) — three real, checkable
  claims per side, adapted from the pitch already written in `README.md`'s "Why" section rather
  than inventing new marketing copy from scratch.
- **FAQ preview** (new, before the final CTA): the first 3 entries from the real `FAQ` array
  (`src/lib/faq-data.ts`), same `<details>` accordion styling as the actual `/faq` page, with a
  "See all FAQs" link. Also fixed one of those FAQ answers while touching this file — "Can I use
  this on mobile?" still said the game "works best on a larger screen," which was accurate when
  written but stale now that #12 shipped real mobile gameplay support; updated to reflect that.
- Verified live: screenshotted the new sections in both themes, confirmed the FAQ accordion
  actually expands, confirmed the pre-existing "Browse courses" scroll-to-`#courses-section`
  anchor still works correctly with the new sections inserted before it. `tsc`/`eslint`/
  `next build` clean, full Playwright suite (7 tests) still passes.

### 2. Learn page — many more courses, categorized, with "Show more" pagination

~~**Shipped — all three planned courses (React, Node.js, MongoDB) plus the pagination UI.**~~
The catalog grew from 4 tracks to 7: JavaScript, Python, HTML, CSS, React, Node.js, MongoDB —
frontend, backend, and database, exactly the spread originally asked for.

- **React** (`src/lib/tracks/react.ts` + `src/lib/reference/react.ts`) — found already fully
  built (6 levels, easy→hard: JSX & Components, Props, State with useState, Event Handling,
  Conditional Rendering, Rendering Lists & Keys; 10-section reference docs) from earlier in this
  session, before this file's own entry was last updated — verified rather than assumed: played
  all levels via Playwright, confirmed `/docs/react` renders all 10 sections, confirmed it was
  already wired into `TRACKS`/`REFERENCES`/`TrackIcon` (`SiReact`).
- **Node.js** (`src/lib/tracks/nodejs.ts` + `src/lib/reference/nodejs.ts`, new) — 6 levels,
  easy→hard: CommonJS Modules, require() & Built-ins, Reading Files with fs, Creating an HTTP
  Server, Async/Await with fs.promises, Basic Express Routing (the hard capstone, since Express
  is the near-universal real-world choice for a Node backend, not just core-API trivia).
  10-section reference docs, including npm/package.json, environment variables, and async error
  handling. `SiNodedotjs` wired into `TrackIcon`.
- **MongoDB** (`src/lib/tracks/mongodb.ts` + `src/lib/reference/mongodb.ts`, new) — 6 levels,
  easy→hard: Inserting a Document, Finding Documents, Query Operators, Updating Documents,
  Deleting Documents, and an Aggregation Pipeline level as the hard capstone — deliberately
  mirroring the exact `$group`/`$sum` pattern `progress-db.ts`'s own real `getLeaderboard()`
  aggregation uses, a genuine thematic tie-in ("the database Theebug itself runs on," per the
  track description) rather than a generic example. 10-section reference docs, including schema
  design (embedding vs. referencing) and connecting from Node.js. `SiMongodb` wired into
  `TrackIcon`.
- **"Show more" pagination** (`src/components/site/course-grid.tsx`, new): `/learn` shows a max
  of 8 cards, with a "Show N more courses" button revealing the rest — client component, no new
  route. Verified the actual reveal behavior works (not just "compiles"): temporarily lowered the
  cap to 3 against the catalog, confirmed via Playwright that exactly 3 cards show initially and
  clicking the button reveals the rest, then restored the real cap of 8 before shipping. Still
  hasn't visibly triggered in production (7 tracks ≤ 8), but is proven correct and ready for the
  next course added.
- **Marketing copy made evergreen, not just patched again**: rather than keep appending each new
  language to "JavaScript, Python, HTML, and CSS"-style taglines forever (`layout.tsx` metadata,
  the landing page hero, README), switched those specific spots to "JavaScript, Python, and
  more — frontend, backend, and databases" — accurate, and doesn't need another edit next time a
  course ships. The FAQ's "What languages can I learn?" answer deliberately stayed exhaustive
  and specific instead (a direct question deserves a direct, complete answer, unlike a tagline).
- Verified every course end-to-end via Playwright, not just typechecked: all 18 levels (React 6 +
  Node.js 6 + MongoDB 6) play correctly and award the right difficulty-weighted score for their
  tier; all three new/expanded docs pages render their full section count. `tsc`/`eslint`/
  `vitest` (15 tests)/`next build` all clean, full Playwright suite (9 tests, `--workers=2`)
  passes — see the note under Phase 4 in the build order below about default-parallelism
  flakiness discovered while re-verifying this.

### 5. Docs content — scale it up like a real docs site, keep the shell exactly as-is

~~**Shipped.**~~ `docs-track-view.tsx`'s layout/shell was not touched, as explicitly asked —
content-only.

**Found while starting this**: `src/lib/reference/python.ts` was already at full 12-section
JS-quality depth (checked before writing anything — it had genuinely already been done in an
earlier pass this session, before `upgrade-plan.md` itself was created, so this file's own
description of it as "still baseline depth" was stale). Only HTML and CSS were actually still
shallow (5 sections each, ~37 lines, one line of body text per section) — confirmed directly
rather than trusting the earlier writeup.

- **`src/lib/reference/html.ts`**: grown from 5 to 10 sections. Kept the 5 original topics
  (Headings & Paragraphs, Links, Images, Lists, Divs & Classes → renamed "Divs, Spans &
  Classes") and deepened each to the JS bar (2-3 body paragraphs, 1-2 labeled examples, a tip),
  then added 5 new sections beyond what any game level currently covers — matching how the JS
  docs already go deeper than just the JS *levels'* topics: Document Structure, Semantic HTML,
  Forms & Inputs, Tables, Accessibility Basics.
- **`src/lib/reference/css.ts`**: grown from 5 to 10 sections the same way. Kept and deepened
  Selectors & Color, The Box Model, Flexbox Basics, Font & Text, Backgrounds & Radius, Hover
  State (renamed "Hover & Other Pseudo-Classes"), and added CSS Grid, Positioning, Units,
  Responsive Design & Media Queries.
- Friendly, non-intimidating tone applied throughout both, matching the explicit ask — plain
  explanations of *why* something works the way it does (e.g. why `rem` is usually safer than
  `em`, why a missing `alt` is worse than an empty one), not terse API-reference phrasing.
- Verified: sidebar section-link count confirmed 10/10 for both tracks via Playwright, screenshotted
  `/docs/html` to confirm rendering, and re-ran the existing `docs-scroll-spy.spec.ts` suite (which
  specifically exercises HTML/CSS as the "short docs page" edge case) — all 3 tests still pass
  with the new, deeper content. `tsc`/`eslint`/`next build` clean, full suite (15 unit + 7 e2e)
  still passes.

### 7. About page — make it visually creative, not a wall of paragraphs

~~**Shipped.**~~ `src/app/(site)/about/page.tsx` rebuilt from 4 prose paragraphs into: a short
lede (not a full paragraph), a 3-card "pillar" grid (No blank page / Instant feedback / Feels
like the real thing, each with a lucide icon), a "meet your coach" block reusing `WormMascot`
(same mascot component the landing page uses), and a closing CTA card linking to `/learn`. Kept
every real claim from the original copy — none of the substance was cut, only the presentation
changed.

**Real bug caught while verifying, not just a visual pass**: a `<span>...</span> text` pattern on
the same source line (`Debug the Worm</span> explains...`) silently lost its space in the
rendered HTML — confirmed via raw `curl` output showing `</span>explains` with no space. Root
cause: JSX trims leading whitespace on each line of a text node independently, and the word
immediately after the tag was that line's *first* token, so its leading space got treated as
line-leading whitespace and stripped — a well-known but easy-to-miss JSX gotcha. Fixed with an
explicit `{" "}` between the tag and the text. Would not have been caught by a visual skim alone
at normal reading distance — only surfaced by literally reading the rendered output.

### 8. Leaderboard — rank-colored borders for top 3 + a motivational line

~~**Shipped.**~~ `src/app/(site)/leaderboard/page.tsx`: top 3 rows now get a fixed (not
theme-dependent) gold/silver/bronze border + subtle background tint + glow — `Crown` icon for
#1, `Medal` for #2/#3, colors intentionally not theme CSS variables since medal colors are
universally recognized and shouldn't shift with light/dark (same reasoning already established
for the traffic-light dots and `LogoMark`'s fixed brand colors). Added a "keep climbing" motto
below the list, plus a small "Be the first!" nudge on the empty state. Verified against real
production leaderboard data (this app already has a live signed-in user on it) — confirmed the
gold treatment renders correctly; silver/bronze use the identical code path (just a different
array index into the same fixed style list) so weren't separately re-verified against real data,
just trusted as the same deterministic logic.

### 9. Scoring/points system redesign — reduce ties, reward more than just "did you finish"

~~**Shipped, first slice (difficulty multiplier + ms tiebreaker), per the decided plan.**~~ Speed
bonus, streak bonus, and hint cost remain a later increment (not built this pass).

- **Difficulty multiplier** (`src/lib/scoring.ts`): `calculateLevelScore` now takes
  `(mistakes, difficulty)`. Base score scales by difficulty — easy 100 / medium 150 / hard 200 —
  with the same *proportional* shape as the old formula: 10% of base deducted per mistake,
  floored at 40% of base. Easy levels behave byte-for-byte identically to before (100, -10/
  mistake, floor 40) — this is additive, not a rebalance of existing content. New
  `getLevelMaxScore(difficulty)` exported for reuse. Verified live: a hard level (JS lesson 6,
  "Closures") with zero mistakes now awards **+200**, confirmed via a scripted Playwright drag +
  reading the reward modal's actual displayed points, not just unit tests.
- **`badges.ts`'s "Perfectionist" fix**, done in the same pass as flagged: now compares
  `trackProgress.score` against `sum of getLevelMaxScore(level.difficulty)` per track instead of
  the old hardcoded `levels.length * 100` — stays correct now that levels have different max
  values. `badges.test.ts` needed no changes (its mock levels are all `"easy"`, where the old and
  new max happen to coincide).
- **Millisecond-precision leaderboard tiebreaker**: `TrackProgress` gained an optional
  `totalTimeMs` field (`progress-store.ts`) — real `Date.now()`-based elapsed time per completed
  level (not the once-a-second-rounded `elapsedSeconds` used for the on-screen timer), summed
  cumulatively per track the same way `score` already is, persisted through both the localStorage
  and MongoDB paths (`game-context.tsx`, `progress-db.ts`, `/api/progress`'s manual validation).
  `getLeaderboard()`'s aggregation now also sums `totalTimeMs` per user and sorts
  `{ totalScore: -1, totalTimeMs: 1 }` — score still wins first, faster total time silently breaks
  a tie. Old progress docs with no `totalTimeMs` field contribute `0` via Mongo's `$sum`
  (acceptable at this project's scale — not worth a migration script for a tiebreaker). Not
  surfaced in the leaderboard UI — sort key only, per the original "give it a tiebreaker" ask, not
  a new visible stat.
- Verified: `tsc --noEmit`/`eslint .`/`vitest run` (15 tests, `scoring.test.ts` rewritten for the
  new per-difficulty signature)/`next build` all clean; full Playwright suite (7 tests) passes —
  one run had a single flake in the "clean completion" test under 6-worker parallel load,
  re-confirmed 3/3 passing in isolation and 7/7 on a subsequent full run, so not a real regression
  from this change (matches the same class of pre-existing drag/hydration timing sensitivity
  `plan.md` already documents elsewhere, not something newly introduced here).

**Real bug found while scoping this, pre-existing, not introduced by the above — logging it
rather than silently fixing or ignoring it**: `dropBlock`'s completion branch always does
`nextScore = score + levelScore`, **even when replaying an already-completed level** — only
`completedLevels` guards against duplicates, not `score`. So repeatedly re-completing the same
level (e.g. clicking into `Sidebar` and dragging the same correct answer again) inflates a
track's score without bound, which would also eventually push a track's score *above* its true
max and make the "Perfectionist" badge's exact-equality check silently un-earnable (not crash —
just never trigger). Not fixed here: a real fix needs a product decision (should replaying be
free/no-op, only count the better of two attempts, or something else) that's outside this task's
scope — flagging it as its own open item so it doesn't get silently forgotten.

### 10. Sidebar: drop Privacy, add an "Updates"/changelog page instead

~~**Shipped.**~~ New `src/app/(site)/updates/page.tsx` — a vertical release timeline (connecting
line + icon-in-circle per release, version pill, date, bullet highlights), deliberately *not* a
git-log/terminal-diff look, per the note already in `plan.md`'s design history that a prior
terminal/diff-vocabulary direction was explicitly rejected once as "too common, looks
AI-generated." Content is real release history grounded in what `plan.md`/this file actually
document (v0.1 initial Figma rebuild through v0.5, the in-progress work from this very phase) —
no invented features, no fabricated dates beyond the day-level granularity real git history
actually supports.

**Technical fix, exactly as scoped**: `src/lib/site-pages.ts`'s `SitePage` type gained an
optional `hidden` flag. Privacy now has `hidden: true` instead of being deleted outright —
`SiteSidebar` filters hidden entries out of its rendered list, but `findSitePage()` (which drives
the tab-bar breadcrumb) still searches the *full*, unfiltered array, so `/privacy`'s breadcrumb
still correctly resolves to "privacy.md" instead of silently falling back to "Home." Verified
live: sidebar file list shows `updates.md` and no longer shows `privacy.md`; visiting `/privacy`
directly still shows the correct `privacy.md` tab label. `SiteFooter`'s existing separate
`/privacy` link is untouched, so Privacy stays reachable exactly as intended. Also added
`/updates` to `sitemap.ts`. `tsc`/`eslint`/`next build` clean, full Playwright suite (7 tests)
still passes (this touched shared nav components used on every site page).

### 11. Terminal — make the IDE chrome actually functional: resizable + real tabs + live output

`src/components/game/terminal.tsx` already *looks* like a real IDE bottom panel but most of it
is decorative today, confirmed in code:
- `const TABS = ["TERMINAL", "PROBLEMS", "OUTPUT", "DEBUG CONSOLE"]` renders all four tab labels,
  but there's no click handler or active-tab state — `i === 0` is hardcoded, so TERMINAL always
  looks active and the other three do nothing when clicked.
- The panel is a fixed `h-[110px]`, not resizable — no drag handle, no expand/collapse.
- The `⊕`/`⋮`/`×` icons in the tab bar's top-right are also just static characters, no
  `onClick`.
- It only ever shows one combined log stream (`terminalLogs` from `game-context.tsx`) — there's
  no real separation of "problems" (e.g. a wrong-drop's expected-vs-actual) vs. "output" vs. a
  debug console, since there's only ever been one log array.

~~**Shipped.**~~ `src/components/game/terminal.tsx` rewritten:
- **Tabs actually switch content now**, with real per-tab state (`activeTab`): **Terminal**
  shows the full combined log (unchanged); **Problems** filters to error entries only, styled as
  real problem-panel rows (red `AlertCircle` icon, red text, a red count badge on the tab itself,
  "No problems detected." when clean); **Output** filters to everything *except* errors (the
  clean success/system trail); **Debug Console** is a live state view — not log-based at all —
  showing `mistakes`, `elapsedSeconds`, `wormMood`, current level filename, and every zone's fill
  state, updating live as you play (a real "watch panel," reinforcing the coding-education angle
  rather than just decoration).
- **Real error messages, without spoiling the puzzle.** Wrong drops used to log a bare
  `"code" → zoneId ✗`. Now (`game-context.tsx`'s `dropBlock`) they log
  `[error] lessonN.js:L — "code" is not valid here` — a genuine file:line reference (derived by
  searching the level's own `codeLines` for `{{zoneId}}`, so it can't drift out of sync with the
  data) styled like a real compiler/runtime error. Deliberately never names the *correct* answer
  — "expected X, got Y" would have spoiled the puzzle instantly, so it stays a generic-but-real
  "doesn't fit here" message instead.
- **Resizable, with real min/max clamping.** A pointer-based drag handle (works on touch, not
  just mouse) on the panel's top edge; height is now a controlled `useState` (default 110px, same
  as before) clamped to **80px–360px**. Verified via scripted drags that both ends of the clamp
  actually hold: a huge downward drag settles at exactly 80px (never 0/never fully collapses), a
  huge upward drag settles at exactly 360px (never swallows the editor above it) — an earlier,
  more naive version of this same test showed a confusing 140px result that turned out to be the
  *test script* dragging the mouse off the top of the browser viewport (a Playwright artifact,
  not an app bug) — re-verified cleanly once the test isolated each drag on a fresh page load.
- Verified end-to-end: screenshotted all four tabs (including a real wrong-drop populating
  Problems with the new error format) and the resized state; confirmed zero mobile regression at
  390px (no horizontal overflow, Problems tab renders correctly there too, matching the mobile
  work from #12). `tsc`/`eslint`/`vitest` (still 15 tests)/`next build` all clean, full Playwright
  suite (7 tests) still passes.

### 14. Difficulty should scale problem *complexity*, not just problem count

~~**Prototype shipped**, per the decided plan (1-2 hard levels, before mass-authoring in
Phase 4).~~

**Found while scoping, before writing any new content**: same-line multi-zone levels
already existed — `html.ts`/`css.ts` already have levels with two `{{zoneN}}` placeholders on
one literal line (e.g. `'<img {{zone1}}="worm.png" {{zone2}}="Debug the worm" />'`), and
`editor-area.tsx`'s line-parser (`line.split(/(\{\{[^}]+\}\})/)`) already handles any number of
zones per line generically. So this was lower-risk than the original write-up assumed — a proven
mechanic, not new engine work — just not yet used on JS/Python's **hard** tier specifically,
which is what this prototype set out to prove.

Converted two existing hard levels (one per language, to prove it across languages, not just
repeat the same trick once):
- **JS lesson 7, "Destructuring in Callbacks"** (`src/lib/tracks/javascript.ts`): line now reads
  `students.{{zone1}}((sum, {{zone2}}) => sum + score, 0)` — zone1 picks the right array method
  (`reduce`, vs. distractors `map`/`filter`/`forEach`), zone2 destructures the callback parameter
  (`{ score }`, vs. `score`/`{ name }`/`student`). Two genuinely independent decisions on one
  line, not just two arbitrary blanks — picked specifically because `reduce` vs. `map`/`filter`
  is a real, common conceptual mix-up.
- **Python lesson 9, "Error Handling"** (`src/lib/tracks/python.ts`): line now reads
  `{{zone1}} {{zone2}}:` — zone1 is the syntax keyword (`except`), zone2 is the *specific*
  exception type `int()` actually raises (`ValueError`, vs. `TypeError`/`KeyError`/`Exception` —
  all real Python exceptions, just not the one this call raises). Tests syntax *and* whether the
  player actually knows what error a given call produces, not just the keyword.
- Both levels' `objective`/`wormIntro`/`wormCorrectAll`/`concept` copy rewritten to explain both
  decisions, not just one.
- Verified live via scripted Playwright drags on both (not just visual/unit checks): both render
  as two distinct same-line drop zones ("0/2 slots correct" tracker), both award **+200** (hard
  base, zero mistakes) on a clean run, screenshotted both the in-progress and completed states.
  Full suite re-verified after: `tsc`/`eslint`/`vitest`/`next build` clean, all 7 Playwright e2e
  tests pass.

**Not done this pass, left as explicitly out of scope for a prototype**: timed pressure elements
and harder/more deceptive distractor blocks generally (mentioned in the original ask as other
"gameplay currently is lacking" ideas) — this item was specifically about proving the
multi-block-per-line mechanic; broader mechanic ideas stay a separate future conversation.

### 15. Confirm-before-leaving dialog when exiting a level mid-attempt

~~**Shipped.**~~ New `src/components/game/leave-confirm-dialog.tsx` — same accessible-dialog
shape as `LevelCompleteModal` (focus trap, Escape-to-dismiss, restores focus to whatever was
focused before it opened), but defaults focus onto the *safe* action ("Stay and finish") rather
than the dialog container, since a mistimed Enter here would discard real progress. `MenuBar`'s
Home `<Link>` (kept as a real anchor, not swapped for a button, so right-click/open-in-new-tab
still work) intercepts its click via `preventDefault()` and shows the dialog **only when
`levelComplete` is false** — clicking Home on an already-completed level still navigates
immediately, no interruption. "Leave anyway" calls `router.push("/")`; "Stay and finish" or
Escape just closes the dialog and leaves you on the level.

Verified live via Playwright, not just visually: on an incomplete level, clicking Home keeps the
URL unchanged and shows the dialog with "Stay and finish" already focused; Escape dismisses it;
clicking "Leave anyway" navigates to `/`; on an already-*completed* level (played to the reward
modal, then "Review level"), clicking Home navigates straight to `/` with no dialog at all. Scoped
to the in-app Home link only, as asked — browser back/tab-close isn't covered (that would need the
`beforeunload` API, a different mechanism, and wasn't part of the explicit ask).

### 17. SEO — get found when someone searches "Theebug" or related terms. **All code shipped — one manual step left that only the user can do.**

Ask: real discoverability, not just "the sitemap technically exists" — if someone searches the
site's name or what it does, it should actually show up, with a real-looking result (title,
description, maybe an image), not a bare blue link.

**Shipped**: `src/app/layout.tsx` now sets `metadataBase`, a full `openGraph`/`twitter` block
(title/description/site name/a 1200×630 preview image), and a `keywords` array; a schema.org
`WebSite` JSON-LD block (name/url/description) is rendered in `<body>` so search engines can
associate the name "Theebug" with the site specifically, not just index pages by keyword; a real
OG preview image now exists at `src/app/opengraph-image.tsx` (Next's file-convention
`ImageResponse`, reusing `LogoMark`'s exact SVG/brand colors — verified it renders a real
1200×630 PNG, confirmed via `curl`). A new `src/lib/site-constants.ts` (`SITE_URL`/`SITE_NAME`)
is now the single source of truth, reused by `layout.tsx`, `sitemap.ts`, and `robots.ts` (which
previously each hardcoded the domain string separately). Verified end-to-end: `next build`
clean, `/opengraph-image` registered as its own static route, and the rendered homepage HTML
contains the expected `og:*`/`twitter:*` meta tags and both JSON-LD scripts.

**Update — domain decision resolved, not by me.** The user deleted `theebug.vercel.app` entirely
(confirmed via `curl`: now 404s `DEPLOYMENT_NOT_FOUND`) and kept `theebug.cc.cd` as the one and
only production domain. `SITE_URL` in `src/lib/site-constants.ts` is now
`https://www.theebug.cc.cd` (the exact URL that serves 200 — bare `theebug.cc.cd` 307-redirects
here), which automatically propagates to `layout.tsx`'s `metadataBase`/OG/Twitter tags,
`sitemap.ts`, and `robots.ts`. Also fixed the same stale-domain reference in `README.md`'s Live
link and several spots in `plan.md`.

**Real bug surfaced by this domain change, not just a docs cleanup**: `plan.md`'s "Deployment"
section documents the production GitHub OAuth App's callback URL as
`https://theebug.vercel.app/api/auth/callback/github` — now a dead domain. Classic GitHub OAuth
Apps only support one callback URL each, and that setting lives on GitHub's own site
(github.com/settings/developers), not in this repo, so it wasn't touched when the domain was
deleted. **GitHub sign-in on production is very likely broken right now** until the user updates
that callback URL to `https://www.theebug.cc.cd/api/auth/callback/github` themselves — flagged
prominently in `plan.md` as an action item, since this is outside what Claude Code can access or
fix.

**Still open, genuinely can't be finished by me**: two manual steps, both requiring the user's
own account access — Claude Code cannot log into Google or GitHub on the user's behalf:
1. **Google Search Console**: go to search.google.com/search-console, add `https://www.theebug.cc.cd`
   as a property, verify ownership (the DNS-record method is usually simplest since the domain's
   nameservers are already on Vercel), then submit `sitemap.xml` from the Sitemaps section. All
   the code-side prep (the sitemap itself, `robots.txt` pointing at it, real metadata) is already
   done — this is the one step that actually tells Google the site exists and should be crawled.
2. **GitHub OAuth callback URL** (carried over from the domain-deletion finding above): update
   the "Theebug (Production)" OAuth App at github.com/settings/developers to
   `https://www.theebug.cc.cd/api/auth/callback/github`, replacing the dead `theebug.vercel.app`
   one — until this is done, GitHub sign-in on production is very likely broken.

### 18. Console noise — `THREE.Clock` deprecation warning (upstream, no action)

Reported console warning: `THREE.Clock: This module has been deprecated. Please use THREE.Timer
instead.` Checked: `src/components/site/debug-worm-scene.tsx` never calls `THREE.Clock` directly
— it's `@react-three/fiber`'s (`^9.6.1`) internal render loop, which hasn't yet migrated to
`THREE.Timer` while the installed `three` (`^0.185.1`) has deprecated the old API. Nothing is
actually broken; this is upstream library-version noise, not an app bug — no code here to fix.
Real resolution is a future `@react-three/fiber` release adopting `THREE.Timer`; revisit by
bumping the dependency next time deps are touched (see `plan.md`'s "Known placeholders" for the
other already-tracked unused/outdated dependency, `@react-three/drei`).

### 19. Replaying a completed level inflates score without bound (found while building #9)

~~**Fixed.**~~ Decided the product question myself (per this session's standing "you decide"
delegation) rather than waiting: **replaying an already-completed level now only ever helps,
never hurts, and never double-counts** — the best-ever score and fastest-ever time for that
level, tracked independently, not "add every attempt together."

`src/lib/progress-store.ts`'s `TrackProgress` gained a `levelStats?: Record<number, { score:
number; timeMs: number }>` map, keyed by level id — the new source of truth. `score` and
`totalTimeMs` are now always *derived* by summing every level's best score / fastest time across
that map, never incremented directly (`src/lib/game-context.tsx`'s `dropBlock`). Concretely: a
worse replay leaves the track score unchanged; a better replay raises it to the new best; a
faster replay (regardless of score) can still lower the leaderboard-tiebreaker time independently.
Threaded through `progress-db.ts`'s reads and `/api/progress`'s manual validation the same way
every other field already is.

**Real side effect, not a coincidence**: this also genuinely fixes the "Perfectionist" badge
integrity concern raised when this bug was first found — since score can no longer overshoot a
track's true max, `badges.ts`'s `score === maxPossibleScore` check is trustworthy again.

**Migration note, deliberately not engineered further**: progress saved before this field existed
has no `levelStats` (defaults to `{}` on read) — the old cumulative `score` is trusted as-is until
the *next* completion, at which point it becomes purely derived from `levelStats` going forward.
For an existing user, that next completion could show a one-time downward correction if their old
score had already benefited from this exact bug. Accepted rather than building a real migration
script — this project has a tiny real user base at this stage (confirmed: one real leaderboard
entry existed when this was checked), and the "correction" is honest, not a new bug.

Added `e2e/score-integrity.spec.ts` (2 tests, both scripted end-to-end, not just unit-level):
replaying with a deliberately worse attempt (2 mistakes) leaves the stored score unchanged;
replaying with a genuinely better attempt raises it correctly. `tsc`/`eslint`/`vitest` (15
tests)/`next build` all clean; full Playwright suite now 9 tests, all passing (one unrelated
flake in `sign-in-nudge.spec.ts` on the first full run, re-confirmed 3/3 in isolation and 9/9 on
a subsequent full run — the same class of parallel-load flakiness already documented elsewhere
in this codebase, not a regression from this change).

---

## Suggested build order

Sequenced by dependency/leverage — earlier phases are things later phases either reuse directly
or would otherwise need a follow-up pass to retrofit. Decisions below marked "**decided**" are
default starting points chosen to keep things moving; each is still a small, revisitable call
made at the time that phase actually starts, not locked in stone today.

**Phase 0 — Small, isolated, unlocks later phases cleanly. Shipped**, except #17's one remaining
manual step (Search Console verification — see #17).
~~#3 (card width)~~ → ~~#16 (accent font)~~ → ~~#13 (timer UX)~~ → ~~#4 (browse-more-courses
link)~~ → #17 (SEO metadata/OG/JSON-LD code, shipped; canonical-domain decision made, flagged for
override; Search Console verification still open). Reasoning: #3 landed before #2 authors a wave
of new course cards that would inherit the same clipping bug. #16 landed before #1/#7 build new
sections, so those get built with the new type treatment from day one instead of retrofitted
after. #13 and #4 were both trivial and fully independent.

**Phase 1 — Mobile foundation. Shipped.**
~~#6 (docs sidebar)~~ → ~~#12 (gameplay page)~~.
Reasoning: both are "the site doesn't work on a phone" gaps, more severe than polish. Fixing the
underlying responsive patterns now means every later content phase (#2, #5) inherits working
mobile behavior for free, instead of needing a second mobile-check pass after more content ships.

**Phase 2 — Gameplay engine. Shipped.**
~~#9 (scoring)~~ → ~~#14 (difficulty scaling)~~ → ~~#11 (terminal)~~ → ~~#15 (leave-confirm)~~.
Reasoning: #9 and #14 are explicitly linked (more zones/weighted difficulty both reduce score
ties) and should be finalized *before* Phase 4 authors a wave of new hard-level content — new
levels should be built against the final mechanics once, not retrofitted twice.
**Decided starting slice for #9**: ship the difficulty multiplier + millisecond-precision
tiebreaker first (smallest safe change, immediately reduces ties, and forces the
`badges.ts` "Perfectionist" fix to happen alongside it rather than being discovered after — see
#9's blast-radius note). Speed bonus and streak bonus stay as a later increment, evaluated once
the base multiplier is live and its effect on real scores can actually be seen.
**Decided approach for #14**: prototype multi-block-per-line on 1-2 existing hard levels first,
before mass-authoring it into every new course in Phase 4.

**Phase 3 — Visual/creative pages. Shipped.**
~~#1 (landing sections)~~ → ~~#7 (about page)~~ → ~~#8 (leaderboard)~~ → ~~#10 (updates page)~~.
Reasoning: all four are self-contained, no shared dependencies between them — grouped here
because by this point both the new accent font (#16) and finalized mobile patterns (#6/#12)
already exist, so these ship once, correctly, instead of needing a follow-up pass for either.
**Decided starting section for #1**: a stats bar first — it's free (numbers already derivable
from the existing `TRACKS` data, no new prose needed) — then the "why Theebug" comparison, then
an FAQ preview. Testimonials are explicitly deferred: they need real learner content that
doesn't exist yet, a real content-availability dependency, not an arbitrary skip.

**Phase 4 — Content scale-out. All three planned courses shipped — still genuinely open-ended
by design, since more courses can always be added later.**
~~#5 (docs depth)~~ → ~~#2, all three courses (React → Node.js → MongoDB) + the pagination UI~~.
Reasoning: sequenced last on purpose — this is the biggest, most ongoing content-authoring
effort, and it benefits from everything above: a mobile-ready shell (Phase 1), finalized
scoring/difficulty mechanics so new levels are authored once against the real system (Phase 2),
and the new type treatment for any new docs prose (Phase 0).

**Found while re-verifying the full Playwright suite at the end of this phase**: the default
6-worker parallelism intermittently fails 1-2 tests per run on this machine (different test each
time — `level-complete`, `sign-in-nudge`) purely from resource contention running that many real
Chromium instances with timing-sensitive drag-and-drop at once, confirmed *not* a code regression
by re-running the exact same suite with `--workers=2`, which passes 9/9 consistently. Worth a
look — either lowering `workers` in `playwright.config.ts`, or just knowing to re-run at reduced
parallelism if a future CI/local run shows a similar single-test failure — but not something that
blocked shipping anything in this phase, since every failure was confirmed non-reproducible in
isolation.

---

## Shipped

- ~~**#3. Level cards clip long titles.**~~ **Fixed.** Grid `minmax()` floor bumped 220px→230px
  in `src/app/(site)/learn/page.tsx` and `.../learn/[track]/page.tsx`; `LevelCard`'s header row
  (`src/components/site/level-card.tsx`) now wraps instead of clipping — filename truncates
  first (`min-w-0 truncate`), badges are `shrink-0`, container is `flex-wrap`, so a long title
  drops to its own line inside the card instead of being cut off by the card's `overflow-hidden`.
- ~~**#4. No way back to `/learn` from a track's syllabus page.**~~ **Fixed.** Added a "Browse
  more courses" link (with a small back-arrow) above the track header in
  `src/app/(site)/learn/[track]/page.tsx`, linking to `/learn`.
- ~~**#13. Timer looks frozen/broken on a completed level.**~~ **Fixed.** `RightPanel`
  (`src/components/game/right-panel.tsx`) now shows a small green checkmark next to the timer
  when `levelComplete` is true, with a title tooltip ("Timer stops once a level is completed") —
  makes the frozen `0:00`/final time read as intentional instead of broken. No `game-context.tsx`
  changes needed — the timer behavior itself was already correct, only the UI was ambiguous.
- ~~**#16. Second blocky "IDE-style" font for headline emphasis.**~~ **Fixed**, then swapped once
  more per explicit follow-up request ("use Geist Pixel"). Final: **`GeistPixelSquare`** from the
  `geist` npm package (`geist/font/pixel` — Vercel's own pixel/terminal-style family, 5 style
  variants exist, "Square" picked as the most legible), a self-hosted local font via
  `next/font/local` under the hood (no Google Fonts network fetch, unlike the first pass's
  Martian Mono). Wired in `src/app/layout.tsx`, exposed as `--font-geist-pixel-square`, applied
  via `.text-accent-emphasis` in `globals.css` alongside `text-accent` on all 5 emphasis spans in
  `src/components/landing-page.tsx`. Ships a single static weight (500) — `.text-accent-emphasis`
  was corrected to `font-weight: 500` (not 700) to avoid the browser synthetically faux-bolding a
  font that has no real bold cut. Verified live via Playwright: `getComputedStyle` confirms the
  emphasis span's `font-size` exactly matches the parent headline's (54px = 54px, per the explicit
  "don't change font size" instruction) and `font-family` correctly resolves to `GeistPixelSquare`;
  screenshotted the hero and "how it works" heading to confirm the pixel letterforms actually
  render distinctly from the surrounding JetBrains Mono text. `next build` clean.
- **#17. SEO — see the "Still open" note inside item #17 above** (code shipped; canonical-domain
  choice flagged for the user to confirm/override; Search Console verification still manual and
  pending that confirmation) — kept in "Open items" rather than moved here, since it's not fully
  closed.
- ~~**#6. Docs section-jump nav missing on mobile.**~~ **Fixed.** Added `MobileSectionNav` (new,
  inside `src/components/site/docs-track-view.tsx`) — a sticky disclosure below `lg` showing the
  current section, expanding into the same link list on tap; desktop `<aside>` untouched.
  Verified live via Playwright at a 390px viewport: dropdown opens showing all 12 JS sections,
  clicking one scrolls to it, closes the dropdown, and updates the sticky label — scroll-spy
  (`active` state) stayed in sync throughout.
- ~~**#12. Gameplay page has no mobile layout.**~~ **Fixed**, plus two real bugs found and fixed
  along the way (not just the fixed-width panels originally flagged):
  - `Sidebar`/`RightPanel` (`src/components/game/sidebar.tsx` /
    `.../right-panel.tsx`) are now off-canvas drawers below `lg` (same fixed→translate pattern as
    the existing `SiteSidebar`), toggled via two new icon buttons in `MenuBar` and a shared
    backdrop in `GamePlayShell`. New `mobilePanel` state lives in `game-context.tsx` (not local
    component state), since `MenuBar` and the panels aren't siblings under one parent.
  - **Bug found while verifying, not just assumed fixed**: `RightPanel`'s drawer classes
    originally always included the base `translate-x-full` *and* conditionally appended
    `translate-x-0` together (mirroring `Sidebar`'s/`SiteSidebar`'s existing pattern) — but
    unlike `Sidebar`, this resolved incorrectly for `RightPanel` (confirmed via a live
    `getBoundingClientRect()` check: the panel stayed at `x: 390`, fully off-screen, even after
    toggling "open"). Fixed by making the transform classes mutually exclusive via a ternary
    (`mobilePanel === "right" ? "translate-x-0" : "translate-x-full"`) instead of
    always-base-plus-conditional-override, removing any cascade-order ambiguity. Applied the same
    hardening to `Sidebar` even though its original version happened to render correctly.
  - **Second bug found while verifying**: `MenuBar`'s centered title div
    (`Theebug — Learn {track} by Doing`) was `flex-1` without `min-w-0`, so it refused to shrink
    below its own text width (the flexbox default) and forced the whole 30px menu row to 545px
    wide in a 390px viewport — silently clipping everything after it (theme toggle, auth widget,
    the new right-panel toggle, the traffic-light dots) off-screen with no way to reach them, via
    the row's `overflow-hidden` ancestor. Fixed by hiding that title (and the now-redundant "Help"
    label) below `lg`, with a plain spacer replacing it so the utility-icon cluster still sits at
    the right edge on mobile.
  - Verified end-to-end via Playwright at a 390px viewport: zero horizontal overflow on load and
    with either drawer open, both drawers open/close correctly via their toggle buttons and via
    backdrop click, Sidebar closes automatically on selecting a level. Full existing Playwright
    suite (7 tests across `level-complete`, `docs-scroll-spy`, `sign-in-nudge`) still passes, plus
    `tsc --noEmit`/`eslint .`/`next build` all clean.

---

## Testing checklist — what's left before calling this fully finished

Every item above is code-complete and verified by automated means (`tsc`, `eslint`, `vitest`,
`next build`, Playwright). What's listed here is everything that genuinely needs a **human** —
either because it's a manual action Claude Code cannot perform, a subjective/visual judgment
call, real multi-user/real-device behavior no amount of scripted testing can substitute for, or
technical content worth a second pair of eyes since a large amount of it was authored in one
pass. Work through this before considering the plan truly closed out, not just "shipped."

### Manual actions only you can do (external account access)

- [ ] **Google Search Console**: verify `https://www.theebug.cc.cd` as a property
  (search.google.com/search-console) and submit `sitemap.xml`. All the code-side prep is done —
  this is the one step that actually gets the site crawled/indexed. See item #17 above for the
  exact steps.
- [ ] **GitHub OAuth callback URL**: update the "Theebug (Production)" OAuth App
  (github.com/settings/developers) to `https://www.theebug.cc.cd/api/auth/callback/github`,
  replacing the now-dead `theebug.vercel.app` one. **Until this is done, GitHub sign-in on
  production is very likely broken** — worth testing first to confirm, then fixing.
- [ ] **Deploy this work** — none of what's in this file has been merged/deployed yet (confirm
  current `git status`/branch state before assuming otherwise). Recommend a preview deploy first,
  smoke-test there, then promote to production.

### Real accounts / real data (things one single test session can't fully prove)

- [ ] **Leaderboard rank styling with real rank 2 and 3.** Only ever confirmed gold (#1) against
  real production data — this app currently has exactly one real opted-in leaderboard entry, so
  silver/bronze styling was verified by code-reading (same logic path, different array index),
  not by seeing it rendered with real second/third-place users. Worth a look once more accounts
  exist.
- [ ] **The #19 scoring fix, with an existing real account that has old-format progress.**
  If any real signed-in user completes a level for the first time after this update, watch for
  the documented one-time score adjustment (their stored score may shift slightly if it had
  previously benefited from the replay-inflation bug) — expected and correct, but worth actually
  observing once rather than only trusting the write-up.
- [ ] **Leaderboard time-tiebreak with two real competing accounts.** The `totalTimeMs` tiebreak
  (#9) has unit/e2e coverage for the derivation logic, but has never been observed actually
  breaking a real tie between two different real users on the live leaderboard.

### Real devices (Playwright's viewport emulation is not the same as the real thing)

- [ ] **An actual phone**, not just a 390px emulated viewport: gameplay drag-and-drop via real
  touch, the docs mobile section-jump dropdown, the `/learn` course grid + "Show more" button, the
  terminal's resize handle (pointer events were used specifically to support touch, but never
  tested on a real touchscreen).
- [ ] **A tablet-sized viewport** — everything so far was tested at phone width (390px) and
  desktop width (1280px); the in-between range hasn't been specifically checked.
- [ ] **At least one non-Chromium browser** (Safari and/or Firefox) — every automated check in
  this whole plan ran on Chromium only (Playwright's default). `react-dnd`'s HTML5 drag-and-drop
  backend and CSS Grid/Flexbox both have occasional real cross-browser quirks worth a spot check,
  especially on Safari/iOS given how central drag-and-drop is to the whole product.

### Content accuracy (a lot was authored in one pass — worth a second pair of eyes)

- [ ] **Technical accuracy pass on the new/expanded docs content**: HTML (10 sections), CSS (10
  sections), Node.js (10 sections), MongoDB (10 sections), React (10 sections) — all
  freshly-written explanatory prose and code examples. Spot-check for anything subtly wrong,
  especially in the newer/less universally-known areas (Node's `fs/promises`, MongoDB's
  aggregation pipeline, Express routing specifics).
- [ ] **Playtest the 18 new levels** (React 6, Node.js 6, MongoDB 6) as an actual learner, not
  just scripted-correct-answer verification — confirm the distractor blocks are genuinely
  plausible-but-wrong (not obviously fake), the difficulty curve feels right level-to-level, and
  the worm narration/concept recaps actually teach the concept clearly to someone encountering it
  cold.
- [ ] **Read the new landing-page copy and About page out loud once** — the "why Theebug"
  comparison, the FAQ preview, the About page pillars — for tone/typos a silent read can miss.
- [ ] **The Updates page's release history** — confirm the version numbers/dates/feature
  groupings still make sense to a real visitor with no session context, not just internally
  consistent with this file.

### Explicitly deferred, not bugs — revisit only if you want them

- [ ] Speed bonus / streak bonus / hint-cost scoring (the rest of #9 beyond the difficulty
  multiplier + ms tiebreaker already shipped).
- [ ] Leave-confirmation dialog (#15) only covers the in-app Home link — browser back button /
  tab close is not covered (would need the `beforeunload` API, a different mechanism).
- [ ] Node.js and MongoDB were the two remaining courses from the original "many more courses"
  ask — now both shipped. C#, PHP, SQL, and further framework/language tracks remain open-ended
  future additions, not a fixed backlog.

### General regression pass

- [ ] Full manual click-through of every nav path at least once: `SiteSidebar`, `SiteFooter`,
  `SiteTopBar`'s mobile hamburger, the game `Sidebar`'s mobile drawer, the game `RightPanel`'s
  mobile drawer — confirm nothing from earlier phases regressed after all the Phase 4 content
  additions.
- [ ] `npx playwright test` at the **default worker count** occasionally shows one flaky failure
  (see the note under Phase 4 above) — if this keeps happening, worth actually lowering `workers`
  in `playwright.config.ts` rather than re-running around it forever.
