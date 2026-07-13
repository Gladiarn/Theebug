"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/lib/game-context";

const TABS = ["TERMINAL", "PROBLEMS", "OUTPUT", "DEBUG CONSOLE"];

export function Terminal() {
  const { terminalLogs } = useGame();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  return (
    <div className="flex h-[110px] shrink-0 flex-col border-t border-border bg-bg transition-colors duration-200">
      <div className="flex h-[27px] shrink-0 items-center border-b border-border bg-panel px-3">
        {TABS.map((tab, i) => (
          <div
            key={tab}
            className={`flex h-[27px] cursor-pointer select-none items-center border-b px-3 text-[11px] tracking-wide ${
              i === 0 ? "border-text text-text" : "border-transparent text-text-muted"
            }`}
          >
            {tab}
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex gap-2.5 text-[13px] text-text-muted">
          <span className="cursor-pointer">⊕</span>
          <span className="cursor-pointer">⋮</span>
          <span className="cursor-pointer">×</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-1 font-mono text-xs text-text">
        {terminalLogs.map((log, i) => {
          const isSystem = log.startsWith("[system]");
          const isCorrect = log.includes("✓");
          const isWrong = log.includes("✗");
          const logClass = isSystem
            ? "text-text-muted"
            : isCorrect
              ? "text-accent-green"
              : isWrong
                ? "text-accent-red"
                : "text-text";
          return (
            <div key={i} className="flex items-baseline gap-1.5 leading-[1.6]">
              <span className="shrink-0 text-accent">$</span>
              <span className={logClass}>{log}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
