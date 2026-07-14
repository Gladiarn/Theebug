"use client";

import { Lightbulb, X } from "lucide-react";
import { useGame } from "@/lib/game-context";

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function starsForMistakes(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

export function LevelCompleteModal() {
  const {
    currentTrack,
    currentLevel,
    currentLevelIndex,
    justCompleted,
    mistakes,
    elapsedSeconds,
    lastLevelPoints,
    nextLevel,
    dismissReward,
  } = useGame();

  if (!justCompleted) return null;

  const isLastLevel = currentLevelIndex === currentTrack.levels.length - 1;
  const stars = starsForMistakes(mistakes);
  const { concept } = currentLevel;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Level complete"
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-panel text-text shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-badge-bg px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="font-mono text-sm font-bold text-accent-green">Level Complete!</span>
          </div>
          <button
            onClick={dismissReward}
            aria-label="Close"
            className="cursor-pointer rounded p-1 text-text-muted transition-colors hover:bg-badge-bg hover:text-text"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4">
          <div className="mb-4 flex items-center justify-between rounded border border-border bg-bg px-3 py-2.5">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-text-muted">
                {currentTrack.title} · Level {currentLevel.id}
              </div>
              <div className="font-mono text-sm text-text">{currentLevel.title}</div>
            </div>
            <div className="text-2xl leading-none tracking-wider" aria-label={`${stars} out of 3 stars`}>
              {"★".repeat(stars)}
              <span className="text-border">{"★".repeat(3 - stars)}</span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded border border-border bg-bg px-2 py-2">
              <div className="font-mono text-base font-bold text-accent">+{lastLevelPoints}</div>
              <div className="text-[10px] uppercase tracking-wide text-text-muted">points</div>
            </div>
            <div className="rounded border border-border bg-bg px-2 py-2">
              <div className="font-mono text-base font-bold text-text">{formatElapsed(elapsedSeconds)}</div>
              <div className="text-[10px] uppercase tracking-wide text-text-muted">time</div>
            </div>
            <div className="rounded border border-border bg-bg px-2 py-2">
              <div className={`font-mono text-base font-bold ${mistakes === 0 ? "text-accent-green" : "text-accent-red"}`}>
                {mistakes}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-text-muted">
                mistake{mistakes === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div className="rounded border border-border bg-bg px-3.5 py-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-accent">
              <Lightbulb size={13} />
              What you just learned
            </div>
            <div className="mb-2 text-[13px] font-bold leading-snug text-text">{concept.summary}</div>
            <div className="space-y-2">
              {concept.details.map((paragraph, i) => (
                <p key={i} className="text-xs leading-[1.6] text-text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            {concept.example && (
              <pre className="mt-3 overflow-x-auto rounded border border-border bg-panel p-2.5 font-mono text-[11px] leading-relaxed text-code-plain">
                <code>{concept.example}</code>
              </pre>
            )}
          </div>
        </div>

        <div className="flex gap-2 border-t border-border px-4 py-3">
          <button
            onClick={dismissReward}
            className="flex-1 cursor-pointer rounded border border-border bg-bg py-2 font-mono text-[13px] text-text-muted transition-colors hover:bg-badge-bg hover:text-text"
          >
            Review level
          </button>
          {!isLastLevel && (
            <button
              onClick={() => {
                dismissReward();
                nextLevel();
              }}
              className="flex-1 cursor-pointer rounded border border-accent-green bg-drop-correct-bg py-2 font-mono text-[13px] text-accent-green transition-colors hover:bg-success-hover"
            >
              ▶ Next Level
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
