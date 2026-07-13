"use client";

import { CircleCheckBig, FileCode2 } from "lucide-react";
import { useGame } from "@/lib/game-context";

export function Sidebar() {
  const { currentTrack, currentLevelIndex, completedLevels, goToLevel, score } = useGame();

  return (
    <div className="flex w-[200px] shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar text-xs text-text transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
        <span>Explorer</span>
        <span className="text-sm opacity-50">···</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">
          <span className="text-[9px]">▼</span>
          <span>CODE_CANVAS</span>
        </div>

        {currentTrack.levels.map((level, i) => {
          const isActive = i === currentLevelIndex;
          const isDone = completedLevels.includes(level.id);

          return (
            <button
              key={level.id}
              onClick={() => goToLevel(i)}
              className={`flex w-full items-center gap-1.5 border-l-2 py-1.5 pl-5 pr-2 text-left text-xs outline-none ${
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
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{level.filename}</span>
              {isActive && !isDone && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />}
            </button>
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
