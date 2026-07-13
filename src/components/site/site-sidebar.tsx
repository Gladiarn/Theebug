"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_PAGES } from "@/lib/site-pages";
import { FileIcon } from "./file-icon";

export function SiteSidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex w-[200px] shrink-0 -translate-x-full flex-col overflow-hidden border-r border-border bg-sidebar text-xs text-text transition-transform duration-200 md:static md:translate-x-0 ${
        open ? "translate-x-0" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
        <span>Explorer</span>
        <span className="text-sm opacity-50">···</span>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <div className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">
          <span className="text-[9px]">▼</span>
          <span>THEEBUG</span>
        </div>

        {SITE_PAGES.map((page) => {
          const active = page.href === "/" ? pathname === "/" : pathname.startsWith(page.href);
          return (
            <Link
              key={page.href}
              href={page.href}
              onClick={onNavigate}
              className={`flex items-center gap-1.5 border-l-2 py-1.5 pl-5 pr-2 text-xs text-text outline-none ${
                active ? "border-l-accent-blue bg-sidebar-active" : "border-l-transparent hover:bg-line-hover"
              }`}
            >
              <FileIcon lang={page.lang} className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 truncate">{page.filename}</span>
              {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
