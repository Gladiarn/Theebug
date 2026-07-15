import { Analytics } from "@vercel/analytics/next";
import { GeistPixelSquare } from "geist/font/pixel";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { SITE_NAME, SITE_URL } from "@/lib/site-constants";
import { THEME_STORAGE_KEY } from "@/lib/theme-constants";
import "./globals.css";

const SITE_TITLE = "Theebug — Learn to Code by Doing";
const SITE_DESCRIPTION =
  "Interactive drag-and-drop coding game for JavaScript, Python, HTML, and CSS, guided by a friendly host, enhancing coding skills through engaging challenges.";

// schema.org structured data — helps search engines associate the name "Theebug" specifically
// with this site (rather than only indexing pages by keyword), which is what actually improves
// the odds a brand-name search surfaces a proper result instead of nothing/unrelated pages.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

// Runs before first paint so a returning light-mode visitor never sees a dark flash. Kept as a
// tiny inline script rather than a React effect since effects only run after hydration/paint.
const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light")document.documentElement.classList.add("light");}catch(e){}})();`;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
});

// Second, deliberately-scoped typeface — used only for the accent-emphasis phrase inside
// landing-page headlines (see `.text-accent-emphasis` in globals.css), not site-wide. Vercel's
// Geist Pixel (the "Square" style) gives that emphasis a distinct pixelated look, stronger than
// color alone. Self-hosted local font (no Google Fonts network fetch), ships one static weight
// (500) — don't force a heavier CSS font-weight on it, that just triggers synthetic/faux bold.

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "learn to code",
    "coding game",
    "learn javascript",
    "learn python",
    "learn html css",
    "drag and drop coding",
    "interactive coding tutorial",
    "coding for beginners",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${GeistPixelSquare.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
