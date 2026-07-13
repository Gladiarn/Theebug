"use client";

import { useState, type ReactNode } from "react";
import { AmbientBlocks } from "./ambient-blocks";
import { SiteFooter } from "./site-footer";
import { SiteSidebar } from "./site-sidebar";
import { SiteStatusBar } from "./site-status-bar";
import { SiteTabBar } from "./site-tab-bar";
import { SiteTopBar } from "./site-top-bar";

export function SiteChrome({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-bg text-text transition-colors duration-200">
      <AmbientBlocks />
      <SiteTopBar onMenuClick={() => setSidebarOpen((v) => !v)} />

      <div className="relative flex flex-1 overflow-hidden">
        <SiteSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <SiteTabBar />
          <div className="flex-1 overflow-y-auto">
            {children}
            <SiteFooter />
          </div>
          <SiteStatusBar />
        </div>
      </div>
    </div>
  );
}
