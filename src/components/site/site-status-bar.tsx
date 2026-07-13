"use client";

import { GitBranch } from "lucide-react";
import { usePathname } from "next/navigation";
import { findSitePage } from "@/lib/site-pages";

export function SiteStatusBar() {
  const pathname = usePathname();
  const page = findSitePage(pathname);

  return (
    <div className="flex h-[22px] shrink-0 items-center justify-between bg-accent-blue px-3 font-mono text-[11px] text-white">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          main
        </span>
        <span className="hidden sm:inline">UTF-8</span>
      </div>
      <div className="flex items-center gap-3">
        <span>{page.lang}</span>
      </div>
    </div>
  );
}
