export interface SitePage {
  href: string;
  label: string;
  filename: string;
  lang: string;
  // Resolvable by findSitePage() (so its tab-bar/breadcrumb still shows the right label) without
  // taking a slot in SiteSidebar's file-explorer list — used for Privacy, which now lives in the
  // footer only. Keeping the entry (rather than deleting it outright) is what stops the
  // breadcrumb from silently falling back to "Home" for a page that's still genuinely live.
  hidden?: boolean;
}

export const SITE_PAGES: SitePage[] = [
  { href: "/", label: "Home", filename: "index.tsx", lang: "TypeScript JSX" },
  { href: "/learn", label: "Learn", filename: "learn.md", lang: "Markdown" },
  { href: "/docs", label: "Docs", filename: "docs.md", lang: "Markdown" },
  { href: "/about", label: "About", filename: "about.md", lang: "Markdown" },
  { href: "/faq", label: "FAQ", filename: "faq.md", lang: "Markdown" },
  { href: "/leaderboard", label: "Leaderboard", filename: "leaderboard.md", lang: "Markdown" },
  { href: "/updates", label: "Updates", filename: "updates.md", lang: "Markdown" },
  { href: "/privacy", label: "Privacy", filename: "privacy.md", lang: "Markdown", hidden: true },
];

export function findSitePage(pathname: string): SitePage {
  return SITE_PAGES.find((p) => (p.href === "/" ? pathname === "/" : pathname.startsWith(p.href))) ?? SITE_PAGES[0];
}
