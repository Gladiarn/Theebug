"use client";

import { useState } from "react";
import { CircleCheckBig, FileCode2 } from "lucide-react";
import { useGame } from "@/lib/game-context";
import type { Difficulty } from "@/lib/tracks/types";

const FOLDERS: { difficulty: Difficulty; label: string }[] = [
  { difficulty: "easy", label: "easy" },
  { difficulty: "medium", label: "medium" },
  { difficulty: "hard", label: "hard" },
];

export function Sidebar() {
  const { currentTrack, currentLevelIndex, completedLevels, goToLevel, score, mobilePanel, closeMobilePanel } =
    useGame();
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex w-[200px] shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar text-xs text-text transition-transform duration-200 lg:static lg:translate-x-0 ${
        mobilePanel === "sidebar" ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
        <span>Explorer</span>
        <span className="text-sm opacity-50">···</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">
          <span className="text-[9px]">▼</span>
          <span>THEEBUG</span>
        </div>

        {FOLDERS.map(({ difficulty, label }) => {
          const entries = currentTrack.levels
            .map((level, i) => ({ level, i }))
            .filter(({ level }) => level.difficulty === difficulty);
          if (entries.length === 0) return null;

          const isOpen = openFolders[difficulty] ?? true;

          return (
            <div key={difficulty}>
              <button
                onClick={() => setOpenFolders((f) => ({ ...f, [difficulty]: !isOpen }))}
                className="flex w-full items-center gap-1 px-3 py-1.5 text-left text-[11px] font-bold uppercase tracking-wide text-text-muted hover:bg-line-hover"
                aria-expanded={isOpen}
              >
                <span className="text-[9px]">{isOpen ? "▼" : "▶"}</span>
                <span>{label}</span>
              </button>

              {isOpen &&
                entries.map(({ level, i }) => {
                  const isActive = i === currentLevelIndex;
                  const isDone = completedLevels.includes(level.id);

                  return (
                    <button
                      key={level.id}
                      onClick={() => {
                        goToLevel(i);
                        closeMobilePanel();
                      }}
                      className={`flex w-full items-center gap-1.5 border-l-2 py-1.5 pl-8 pr-2 text-left text-xs outline-none ${
                        isActive
                          ? "border-l-accent-blue bg-sidebar-active"
                          : "border-l-transparent hover:bg-line-hover"
                      } ${isDone ? "text-accent-green opacity-85" : "text-text"}`}
                    >
                      {isDone ? (
                        <CircleCheckBig className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {level.filename}
                      </span>
                      {isActive && !isDone && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 border-t border-border px-3 py-2 text-[11px] text-text-muted">
        <div className="flex justify-between">
          <span>Completed</span>
          <span className="text-accent">
            {completedLevels.length}/{currentTrack.levels.length}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Score</span>
          <span className="font-mono text-accent-yellow">{score}</span>
        </div>
        <div className="mt-0.5 h-[3px] overflow-hidden rounded-sm bg-border">
          <div
            className="h-full rounded-sm bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${(completedLevels.length / currentTrack.levels.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
