// Single source of truth for the canonical production URL — used by layout.tsx's metadataBase/
// OpenGraph, sitemap.ts, robots.ts, and the JSON-LD structured data, so there's one place to
// update if the canonical domain ever changes. theebug.vercel.app was deleted (now 404s) —
// theebug.cc.cd (bare, no `www.`) 307-redirects to this exact URL, which is the one that
// actually serves the site (confirmed via `curl -sI`).
export const SITE_URL = "https://www.theebug.cc.cd";
export const SITE_NAME = "Theebug";
