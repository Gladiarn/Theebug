"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthWidget } from "@/components/site/auth-widget";
import { LogoMark } from "@/components/site/logo-mark";
import { useGame } from "@/lib/game-context";
import { useTheme } from "@/lib/theme-context";

const navLinkClass = (active: boolean) =>
  `inline-flex h-[30px] items-center px-2.5 text-xs outline-none ${active ? "bg-nav-hover" : "hover:bg-nav-hover"}`;

export function MenuBar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { currentTrack, resetLevel } = useGame();
  const playHref = `/play/${currentTrack.id}`;

  return (
    <div className="flex h-[30px] shrink-0 select-none items-center border-b border-border bg-menu px-2 text-xs text-text transition-colors duration-200">
      <div className="mr-1.5 flex items-center justify-center">
        <LogoMark className="h-5 w-5 shrink-0" />
      </div>

      <Link href="/" className={navLinkClass(false)}>
        Home
      </Link>
      <Link href={playHref} className={navLinkClass(pathname.startsWith(playHref))}>
        Play
      </Link>
      <button onClick={resetLevel} className={navLinkClass(false)}>
        Reset
      </button>
      <span className="inline-flex h-[30px] cursor-default items-center px-2.5 text-xs opacity-50">Help</span>

      <div className="flex-1 pointer-events-none text-center text-xs text-text-muted">
        Theebug — Learn {currentTrack.title} by Doing
      </div>

      <button
        onClick={toggleTheme}
        title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        className="mr-2 flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[11px] outline-none transition-colors hover:border-accent"
      >
        {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        <span className="opacity-80">{isDark ? "Light" : "Dark"}</span>
      </button>

      <div className="mr-2">
        <AuthWidget />
      </div>

      <div className="flex gap-1.5">
        {["#FF5F57", "#FEBC2E", "#28C840"].map((color) => (
          <div key={color} className="h-[11px] w-[11px] rounded-full" style={{ background: color }} />
        ))}
      </div>
    </div>
  );
}
