export interface SitePage {
  href: string;
  label: string;
  filename: string;
  lang: string;
}

export const SITE_PAGES: SitePage[] = [
  { href: "/", label: "Home", filename: "index.tsx", lang: "TypeScript JSX" },
  { href: "/learn", label: "Learn", filename: "learn.md", lang: "Markdown" },
  { href: "/docs", label: "Docs", filename: "docs.md", lang: "Markdown" },
  { href: "/about", label: "About", filename: "about.md", lang: "Markdown" },
  { href: "/faq", label: "FAQ", filename: "faq.md", lang: "Markdown" },
  { href: "/leaderboard", label: "Leaderboard", filename: "leaderboard.md", lang: "Markdown" },
];

export function findSitePage(pathname: string): SitePage {
  return SITE_PAGES.find((p) => (p.href === "/" ? pathname === "/" : pathname.startsWith(p.href))) ?? SITE_PAGES[0];
}
