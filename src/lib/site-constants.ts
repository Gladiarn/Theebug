// Single source of truth for the canonical production URL — used by layout.tsx's metadataBase/
// OpenGraph, sitemap.ts, robots.ts, and the JSON-LD structured data, so there's one place to
// update if the canonical domain ever changes (e.g. to the theebug.cc.cd custom domain once its
// setup is finalized — see upgrade-plan.md item #17 for that open decision).
export const SITE_URL = "https://theebug.vercel.app";
export const SITE_NAME = "Theebug";
