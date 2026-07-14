import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { THEME_STORAGE_KEY } from "@/lib/theme-constants";
import "./globals.css";

// Runs before first paint so a returning light-mode visitor never sees a dark flash. Kept as a
// tiny inline script rather than a React effect since effects only run after hydration/paint.
const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light")document.documentElement.classList.add("light");}catch(e){}})();`;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Theebug — Learn to Code by Doing",
    template: "%s — Theebug",
  },
  description:
    "Interactive drag-and-drop coding game for JavaScript, Python, HTML, and CSS, guided by a friendly host, enhancing coding skills through engaging challenges.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
