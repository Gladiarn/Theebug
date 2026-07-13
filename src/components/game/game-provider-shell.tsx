"use client";

import type { ReactNode } from "react";
import { GameProvider } from "@/lib/game-context";
import { MenuBar } from "./menu-bar";

export function GameProviderShell({ trackId, children }: { trackId: string; children: ReactNode }) {
  return (
    <GameProvider trackId={trackId}>
      <MenuBar />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </GameProvider>
  );
}
