"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/game-context";

type TabId = "terminal" | "problems" | "output" | "debug";
const TABS: { id: TabId; label: string }[] = [
  { id: "terminal", label: "TERMINAL" },
  { id: "problems", label: "PROBLEMS" },
  { id: "output", label: "OUTPUT" },
  { id: "debug", label: "DEBUG CONSOLE" },
];

const DEFAULT_HEIGHT = 110;
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 360;

function logClassFor(log: string, isError: boolean): string {
  if (log.startsWith("[system]")) return "text-text-muted";
  if (isError) return "text-accent-red";
  if (log.includes("✓")) return "text-accent-green";
  return "text-text";
}

function LogLine({ log, isError }: { log: string; isError: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5 leading-[1.6]">
      <span className="shrink-0 text-accent">$</span>
      <span className={logClassFor(log, isError)}>{log}</span>
    </div>
  );
}

export function Terminal() {
  const { terminalLogs, mistakes, hintsUsed, cleanStreak, elapsedSeconds, wormMood, zoneFills, currentLevel } =
    useGame();
  const [activeTab, setActiveTab] = useState<TabId>("terminal");
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  useEffect(() => {
    if (activeTab === "terminal" || activeTab === "problems" || activeTab === "output") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs, activeTab]);

  // Dragging the top edge resizes the panel — the handle only ever reads/writes `height`, no
  // other state, so a plain window-level pointer listener pair (added only while actively
  // dragging) is simpler and cheaper than routing this through a library.
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - e.clientY;
      const next = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, dragRef.current.startHeight + delta));
      setHeight(next);
    };
    const onPointerUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const startDrag = (e: React.PointerEvent) => {
    dragRef.current = { startY: e.clientY, startHeight: height };
  };

  const errorLogs = terminalLogs.filter((log) => log.startsWith("[error]"));
  const nonErrorLogs = terminalLogs.filter((log) => !log.startsWith("[error]"));

  return (
    <div
      className="relative flex shrink-0 flex-col border-t border-border bg-bg transition-colors duration-200"
      style={{ height }}
    >
      {/* Resize handle: a thin invisible-until-hovered strip straddling the top border. Pointer
          events (not mouse-only) so this also works from a touch device. */}
      <div
        onPointerDown={startDrag}
        className="absolute -top-1 left-0 right-0 z-10 h-2 cursor-ns-resize touch-none"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize terminal panel"
      />

      <div className="flex h-[27px] shrink-0 items-center border-b border-border bg-panel px-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex h-[27px] cursor-pointer select-none items-center border-b px-3 text-[11px] tracking-wide outline-none ${
              activeTab === tab.id ? "border-text text-text" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
            {tab.id === "problems" && errorLogs.length > 0 && (
              <span className="ml-1.5 rounded-full bg-accent-red/20 px-1.5 text-[10px] text-accent-red">
                {errorLogs.length}
              </span>
            )}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex gap-2.5 text-[13px] text-text-muted">
          <span className="cursor-pointer" title="Drag the top edge to resize">
            ⊕
          </span>
          <span className="cursor-pointer">⋮</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-1 font-mono text-xs text-text">
        {activeTab === "terminal" &&
          terminalLogs.map((log, i) => <LogLine key={i} log={log} isError={log.startsWith("[error]")} />)}

        {activeTab === "problems" &&
          (errorLogs.length === 0 ? (
            <div className="py-1 text-text-muted">No problems detected.</div>
          ) : (
            errorLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-1.5 py-0.5 leading-[1.6]">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-accent-red" />
                <span className="text-accent-red">{log.replace("[error] ", "")}</span>
              </div>
            ))
          ))}

        {activeTab === "output" &&
          nonErrorLogs.map((log, i) => <LogLine key={i} log={log} isError={false} />)}

        {activeTab === "debug" && (
          <div className="flex flex-col gap-0.5">
            <div>
              <span className="text-code-comment">{"// live game state"}</span>
            </div>
            <div>
              <span className="text-accent">level</span>: {currentLevel.filename}
            </div>
            <div>
              <span className="text-accent">mistakes</span>: {mistakes}
            </div>
            <div>
              <span className="text-accent">hintsUsed</span>: {hintsUsed}
            </div>
            <div>
              <span className="text-accent">cleanStreak</span>: {cleanStreak}
            </div>
            <div>
              <span className="text-accent">elapsedSeconds</span>: {elapsedSeconds}
            </div>
            <div>
              <span className="text-accent">wormMood</span>: &quot;{wormMood}&quot;
            </div>
            <div>
              <span className="text-accent">zoneFills</span>:
            </div>
            {currentLevel.zones.map((zone) => {
              const fill = zoneFills[zone.id];
              const value = fill === null || fill === undefined ? "null" : `{ correct: ${fill.correct} }`;
              return (
                <div key={zone.id} className="pl-4">
                  {zone.id}: {value}
                </div>
              );
            })}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
