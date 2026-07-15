"use client";

import { useGame } from "@/lib/game-context";
import { BottomPanel } from "./bottom-panel";
import { EditorArea } from "./editor-area";
import { LevelCompleteModal } from "./level-complete-modal";
import { RightPanel } from "./right-panel";
import { Sidebar } from "./sidebar";
import { SignInNudge } from "./sign-in-nudge";
import { Terminal } from "./terminal";

export function GamePlayShell() {
  const { mobilePanel, closeMobilePanel } = useGame();

  return (
    <div className="relative flex h-full overflow-hidden">
      <Sidebar />
      {mobilePanel !== "none" && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeMobilePanel}
          aria-hidden
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <EditorArea />
        <Terminal />
        <BottomPanel />
      </div>
      <RightPanel />
      <LevelCompleteModal />
      <SignInNudge />
    </div>
  );
}
