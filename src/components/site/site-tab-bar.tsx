"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { findSitePage } from "@/lib/site-pages";
import { FileIcon } from "./file-icon";

export function SiteTabBar() {
  const pathname = usePathname();
  const page = findSitePage(pathname);

  return (
    <div>
      <div className="flex h-[35px] shrink-0 items-center border-b border-border bg-sidebar">
        <div className="flex h-full items-center gap-2 border-r border-border border-t-2 border-t-accent-blue bg-bg px-4 text-[13px] text-text">
          <FileIcon lang={page.lang} className="h-3.5 w-3.5 text-accent" />
          <span>{page.filename}</span>
          <X className="h-3.5 w-3.5 text-text-muted" />
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex shrink-0 items-center gap-1 border-b border-border-light bg-bg px-4 py-[3px] text-xs text-text-muted">
        <span>CODE_CANVAS</span>
        <span>›</span>
        <span className="text-text">{page.filename}</span>
      </div>
    </div>
  );
}
