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

Reported: the homepage "feels lacking" — wants more content/sections so there's more to
scroll, kept professional, staying visually consistent with the current design (no redesign),
and unique (not a generic template feel).

Current state (`src/components/landing-page.tsx`) — 5 sections total: Hero, "how it works"
(steps), "courses" (track grid, `#courses-section`), "meet your coach" (mascot intro), final
CTA. Reuses `SectionLabel`/`SectionHeading` helpers already defined at the top of that file —
any new section should follow the same pattern for visual consistency.

No specific new sections requested yet — needs either more direction from the user or a set of
concrete proposals (e.g. a stats/numbers bar, a "why Theebug vs. reading docs" comparison, a
testimonials/social-proof strip, an FAQ preview, a roadmap/what's-next teaser) to pick from
before building.

### 2. Learn page — many more courses, categorized, with "Show more" pagination

Wants the course catalog to grow well beyond the current 4 language tracks (JS/Python/HTML/CSS)
to include framework tracks (React, Next.js), database tracks (MongoDB, SQL, MySQL), and
backend tracks (Node.js, Django, etc.).

- **Content scope**: each new course needs the same full shape every track already has
  (`src/lib/tracks/*.ts` — `codeLines`/`zones`/`blocks`/worm narration/`concept` recap per
  level, plus a `src/lib/reference/*.ts` docs page) — this is a real content-authoring effort
  per course, not just a UI change. Same pattern as the JS→Python track buildout earlier.
- **UI scope**: `src/app/(site)/learn/page.tsx` currently renders every `TRACKS` entry
  unconditionally in one grid, no cap. New requirement: show a max of 8 cards initially: a
  "Show more" control expands the grid to reveal the rest (client-side, no new route/page).

### 5. Docs content — scale it up like a real docs site, keep the shell exactly as-is

Explicitly: don't touch `docs-track-view.tsx`'s layout/style (liked as-is) — this is content-only.
Wants the depth/progression real documentation sites have (fundamentals → advanced, friendly
explanatory tone so beginners don't get lost, not just terse syntax reference).

Current state: only JavaScript got the full professional rewrite (12 sections,
`src/lib/reference/javascript.ts`) — Python/HTML/CSS reference content is still baseline depth
(already flagged as a TODO in `plan.md`). This is a real content-authoring task per track, same
bar as the JS rewrite: multiple paragraphs of real explanation per section, 2-3 labeled
examples, a "tip" callout where it helps, and — new from this feedback — a genuinely friendly,
non-intimidating tone throughout (this is a teaching tool, not a terse API reference).

### 7. About page — make it visually creative, not a wall of paragraphs

Current `src/app/(site)/about/page.tsx` (42 lines) reads as plain essay-style text. Wants a more
creative/unique layout — in the same spirit as how the landing page and other pages already use
sectioned, visual layouts — rather than more prose blocks.

### 8. Leaderboard — rank-colored borders for top 3 + a motivational line

`src/app/(site)/leaderboard/page.tsx` currently renders every row with the same
`border-border` styling regardless of rank (only the icon changes: a trophy for top 3, a plain
number otherwise). Wants #1/#2/#3 to visually stand out with distinct border colors (gold/
silver/bronze-style treatment) so top ranks feel earned at a glance, plus a short motivational
line/motto at the bottom of the page encouraging players to climb toward the top spot.

### 9. Scoring/points system redesign — reduce ties, reward more than just "did you finish"

Current formula (`src/lib/scoring.ts`, `calculateLevelScore`): flat `100 - mistakes*10`, floored
at 40 — same base regardless of speed or difficulty, so many players land on identical scores.
Ask: track time at millisecond precision (today's `elapsedSeconds` in `game-context.tsx` already
derives from `Date.now()` but rounds/stores at 1-second resolution) and factor speed — plus
"more features that could contribute to the score" — into the formula so scores actually
differentiate players.

**Needs a joint design decision before building** — a few concrete directions to choose from
(or combine) next time we plan this:
- **Speed bonus**: extra points for finishing under a par time per level, tapering off (not
  unbounded, to avoid runaway scores).
- **Difficulty multiplier**: today an easy and a hard level both award the same base 100 —
  weighting hard/medium levels higher would itself reduce ties and better reward harder content.
- **Streak bonus**: consecutive zero-mistake completions in a session compound a small bonus.
- **Hint cost**, if the hint system from `plan.md`'s roadmap gets built — using a hint reduces
  the level's score, adding another differentiating factor.
- **Millisecond tiebreaker**: even without changing the score itself, storing completion time
  at ms precision (rather than rounding to whole seconds) gives the leaderboard a tiebreaker
  when two players land on the exact same score.

**Real blast-radius note found while scoping this**: `src/lib/badges.ts`'s "Perfectionist"
badge currently infers a zero-mistake track completion from `totalScore === levels.length * 100`
— any change to the base-100-per-level assumption breaks that badge's logic, so badges.ts needs
to be part of this redesign, not a side effect discovered after shipping it. Also, only the
*summed* score currently persists per track (`progress-db.ts`) — no per-level time/mistake
history — so a real ms-based tiebreaker likely needs new persisted fields, not just a formula
tweak.

### 10. Sidebar: drop Privacy, add an "Updates"/changelog page instead

Privacy is fine living in the footer only (it's already there — `SiteFooter` has its own
separate hardcoded `/privacy` link) — no need for it to also take a slot in the file-explorer
sidebar. Replace that slot with a new "Updates" page: a changelog people can browse (v0.0.1,
v0.1, etc.), designed uniquely/creatively to match the site rather than a plain list.

Technical note found while scoping: `src/lib/site-pages.ts`'s `SITE_PAGES` array is the single
registry driving both `SiteSidebar` *and* the tab-bar/breadcrumb (`findSitePage()`, which falls
back to `SITE_PAGES[0]` — "Home" — for any path with no match). Simply deleting the `/privacy`
entry would leave the still-live `/privacy` page's tab-bar breadcrumb silently showing "Home" —
needs a small fix alongside the removal (e.g. keep resolving `/privacy`'s breadcrumb label
without it appearing in the sidebar list). Also: `plan.md`'s design history already notes a
prior "terminal/git-diff vocabulary" direction was explicitly rejected once as "too common,
looks AI-generated" — the Updates page's creative treatment should find its own angle rather
than reaching for that same look.

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

Wants: real VS-Code-style behavior — Problems/Output/Debug Console actually switch content when
clicked (mirroring real IDEs); the panel becomes vertically resizable by dragging its top edge
upward, with a sensible min and max height (never collapsible to 0, never able to swallow the
whole screen); and drag-and-drop feedback should read more like a real IDE surfacing an actual
error (e.g. an "expected X, got Y" style message on a wrong drop) rather than just a plain ✗ log
line. No drag-to-resize pattern exists anywhere else in the game shell yet — this would be new.

### 14. Difficulty should scale problem *complexity*, not just problem count

Ties directly into #9 (scoring) — more zones per level is itself part of what would reduce
near-identical scores. Concrete mechanic idea floated: for medium/hard levels, require dragging
*multiple* separate blocks to complete one line (e.g. a function's name, its parameter list, and
its closing brace/colon as three independent drops) rather than today's pattern of one block
filling one blank per line. Checked the data model: `Level.zones` already supports multiple
`{{zoneN}}` placeholders, including more than one per level (`javascript.ts` level 1 already has
`zone1`/`zone2` across two lines) — so multi-blank-per-line is a **content-authoring** extension
of the existing shape, not a new engine feature. Worth planning alongside #9 and #2 (new
courses) rather than in isolation, since all three are about the same underlying goal: more
depth per level as tracks scale up.

Broader ask: "gameplay currently is lacking" — people can get near-perfect scores too easily and
land on similar scores often. Worth a dedicated planning pass combining this, #9, and general
mechanic ideas (harder distractor blocks, timed pressure elements, etc.) rather than shipping
piecemeal.

### 15. Confirm-before-leaving dialog when exiting a level mid-attempt

`MenuBar`'s home/logo link (`src/components/game/menu-bar.tsx` line 25,
`<Link href="/">`) navigates immediately with no guard. Confirmed this is a real loss, not just
a feeling: progress only persists on level *completion* (`dropBlock`'s `allCorrect` branch in
`game-context.tsx`) — mid-level state (`zoneFills`, `mistakes`, `elapsedSeconds`) is ephemeral
and resets on remount, so navigating away mid-level genuinely does lose that attempt. Wants a
confirmation prompt ("are you sure? this attempt won't be saved") before leaving to Home while a
level is incomplete — likely scoped to the same home-link click, possibly also the browser
back/tab-close case if that's feasible, but the explicit ask was the in-app Home link.

### 17. SEO — get found when someone searches "Theebug" or related terms. **Code shipped, one manual step + one decision left.**

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

**Decided**: kept `https://theebug.vercel.app` as the canonical SEO domain (matches what
`README.md`/`plan.md` already document as "Live," and `theebug.cc.cd` — confirmed via
`vercel domains inspect` — is only aliased as `www.theebug.cc.cd`, not the bare apex, on a free
third-party registrar). `theebug.cc.cd` stays live and functional, just not canonical for SEO
purposes. **Flagging this for the user to override if they'd rather promote the free domain
instead** — it's a real judgment call, not a technical necessity, so worth a conscious yes/no
rather than staying silently decided.

**Still open**: the one *manual* step — verifying the site in **Google Search Console** and
submitting `sitemap.xml` — can't be done via code; do this once the domain choice above is
confirmed, so verification doesn't need to be redone against a different domain later.

### 18. Console noise — `THREE.Clock` deprecation warning (upstream, no action)

Reported console warning: `THREE.Clock: This module has been deprecated. Please use THREE.Timer
instead.` Checked: `src/components/site/debug-worm-scene.tsx` never calls `THREE.Clock` directly
— it's `@react-three/fiber`'s (`^9.6.1`) internal render loop, which hasn't yet migrated to
`THREE.Timer` while the installed `three` (`^0.185.1`) has deprecated the old API. Nothing is
actually broken; this is upstream library-version noise, not an app bug — no code here to fix.
Real resolution is a future `@react-three/fiber` release adopting `THREE.Timer`; revisit by
bumping the dependency next time deps are touched (see `plan.md`'s "Known placeholders" for the
other already-tracked unused/outdated dependency, `@react-three/drei`).

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

**Phase 2 — Gameplay engine.**
#9 (scoring) → #14 (difficulty scaling) → #11 (terminal) → #15 (leave-confirm, bundled into the
same pass since it's the same file area).
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

**Phase 3 — Visual/creative pages.**
#1 (landing sections) → #7 (about page) → #8 (leaderboard) → #10 (updates page).
Reasoning: all four are self-contained, no shared dependencies between them — grouped here
because by this point both the new accent font (#16) and finalized mobile patterns (#6/#12)
already exist, so these ship once, correctly, instead of needing a follow-up pass for either.
**Decided starting section for #1**: a stats bar first — it's free (numbers already derivable
from the existing `TRACKS` data, no new prose needed) — then the "why Theebug" comparison, then
an FAQ preview. Testimonials are explicitly deferred: they need real learner content that
doesn't exist yet, a real content-availability dependency, not an arbitrary skip.

**Phase 4 — Content scale-out.**
#5 (docs depth) → #2 (new courses).
Reasoning: sequenced last on purpose — this is the biggest, most ongoing content-authoring
effort, and it benefits from everything above: a mobile-ready shell (Phase 1), finalized
scoring/difficulty mechanics so new levels are authored once against the real system (Phase 2),
and the new type treatment for any new docs prose (Phase 0).
**Decided starting track for #2**: React first — the most natural extension of the existing JS
track (same audience, same base syntax, reuses the exact authoring pattern already proven with
Python) — then Node.js (pairs directly with JS knowledge already taught), then a database track.
The `/learn` page's "Show more" pagination UI can actually be built any time before this (it's
cheap and independent) — it just has nothing to do until course count actually passes 8.

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
- ~~**#16. Second blocky "IDE-style" font for headline emphasis.**~~ **Fixed.** Added **Martian
  Mono** (`next/font/google`, weight 700, `--font-martian-mono`) in `src/app/layout.tsx`,
  exposed as a new `.text-accent-emphasis` utility class in `globals.css`, applied alongside
  `text-accent` on all 5 emphasis spans in `src/components/landing-page.tsx`. Verified the font
  actually resolves and compiles (checked the built HTML for the Martian Mono CSS module, no
  build errors) — a scoped exception to the site's one-typeface rule, documented as such in both
  files.
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
