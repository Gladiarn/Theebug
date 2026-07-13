"use client";

import { Bug, Github, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { AuthWidget } from "./auth-widget";

export function SiteTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex h-[36px] shrink-0 select-none items-center gap-2 border-b border-border bg-menu px-2 text-xs text-text transition-colors duration-200">
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center rounded p-1 hover:bg-nav-hover md:hidden"
        aria-label="Toggle file explorer"
      >
        <Menu className="h-4 w-4" />
      </button>

      <Link href="/" className="flex items-center gap-1.5 font-mono text-xs font-bold text-text">
        <Bug className="h-4 w-4 text-accent" strokeWidth={1.75} />
        <span className="hidden sm:inline">Code Canvas</span>
      </Link>

      <div className="pointer-events-none flex-1 text-center text-xs text-text-muted">
        Code Canvas — Learn to Code by Doing
      </div>

      <a
        href="#"
        title="View on GitHub"
        className="flex items-center justify-center rounded border border-border p-1.5 text-text-muted outline-none transition-colors hover:border-accent hover:text-text"
      >
        <Github className="h-3.5 w-3.5" />
      </a>

      <button
        onClick={toggleTheme}
        title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        className="flex items-center gap-1.5 rounded border border-border px-2 py-1 text-[11px] outline-none transition-colors hover:border-accent"
      >
        {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        <span className="hidden opacity-80 sm:inline">{isDark ? "Light" : "Dark"}</span>
      </button>

      <Link
        href="/learn"
        className="rounded bg-accent px-2.5 py-1 font-sans text-[11px] font-bold text-white transition-transform duration-150 hover:-translate-y-0.5"
      >
        Start Learning
      </Link>

      <AuthWidget />
    </div>
  );
}
