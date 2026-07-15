"use client";

import { CheckCircle2, Lightbulb } from "lucide-react";
import { useGame, type WormMood } from "@/lib/game-context";
import { WormMascot } from "./worm-mascot";

const MOOD_ANIM: Record<WormMood, string> = {
  neutral: "",
  happy: "worm-happy",
  sad: "worm-sad",
  celebrating: "worm-celebrating",
};

const MOOD_BORDER: Record<WormMood, string> = {
  neutral: "border-accent",
  happy: "border-accent",
  sad: "border-accent-red",
  celebrating: "border-accent-green",
};

const MOOD_TRIANGLE_VAR: Record<WormMood, string> = {
  neutral: "var(--accent)",
  happy: "var(--accent)",
  sad: "var(--accent-red)",
  celebrating: "var(--accent-green)",
};

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function WormCharacter({ mood }: { mood: WormMood }) {
  return (
    <div className={`inline-block h-[64px] w-[64px] origin-bottom ${MOOD_ANIM[mood]}`}>
      <WormMascot mood={mood} className="h-full w-full" />
    </div>
  );
}

export function RightPanel() {
  const {
    currentTrack,
    currentLevelIndex,
    currentLevel: level,
    wormMood,
    wormMessage,
    score,
    levelComplete,
    nextLevel,
    zoneFills,
    elapsedSeconds,
    mobilePanel,
    hintsUsed,
    hintedZoneId,
    useHint,
  } = useGame();
  const isLastLevel = currentLevelIndex === currentTrack.levels.length - 1;
  const correctCount = level.zones.filter((z) => zoneFills[z.id]?.correct === true).length;
  const firstIncorrectZone = level.zones.find((z) => zoneFills[z.id]?.correct !== true);
  const hintDisabled = !firstIncorrectZone || hintedZoneId === firstIncorrectZone.id;

  return (
    <div
      className={`fixed inset-y-0 right-0 z-40 flex w-[265px] shrink-0 flex-col overflow-hidden border-l border-border bg-panel text-[13px] text-text transition-transform duration-200 lg:static lg:translate-x-0 ${
        mobilePanel === "right" ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">
        <span>Game Panel</span>
        <div className="flex items-center gap-2 normal-case tracking-normal">
          <span
            className="flex items-center gap-1 font-mono text-xs text-text-muted"
            title={levelComplete ? "Timer stops once a level is completed" : undefined}
          >
            {levelComplete && <CheckCircle2 className="h-3 w-3 text-accent-green" />}
            {formatElapsed(elapsedSeconds)}
          </span>
          <span className="font-mono text-xs text-accent">{score} pts</span>
        </div>
      </div>

      <div className="border-b border-border px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wide text-text-muted">
            Level {level.id} of {currentTrack.levels.length}
          </span>
          <span className="rounded-full border border-border bg-badge-bg px-1.5 py-px text-[11px] text-accent-yellow">
            {level.title}
          </span>
        </div>
        <div className="flex gap-1">
          {level.zones.map((z) => {
            const fill = zoneFills[z.id];
            return (
              <div
                key={z.id}
                className={`h-[5px] flex-1 rounded-sm transition-colors duration-300 ${
                  fill ? (fill.correct ? "bg-accent-green" : "bg-accent-red") : "bg-border"
                }`}
              />
            );
          })}
        </div>
        <div className="mt-1 text-[11px] text-text-muted">
          {correctCount}/{level.zones.length} slots correct
        </div>
      </div>

      <div className="border-b border-border px-3 py-2.5">
        <div className="mb-1.5 text-[10px] uppercase tracking-wide text-text-muted">Objective</div>
        <div className="text-xs leading-[1.55] text-text">{level.objective}</div>
      </div>

      <div className="border-b border-border px-3 py-2.5">
        <div className="mb-1.5 text-[10px] uppercase tracking-wide text-text-muted">Expected Output</div>
        <div className="rounded border border-border bg-bg px-2.5 py-2 font-mono text-xs">
          {level.preview.map((line, i) => (
            <div key={i} className="text-code-string">
              {line}
            </div>
          ))}
        </div>
      </div>

      {!levelComplete && (
        <div className="border-b border-border px-3 py-2.5">
          <button
            onClick={useHint}
            disabled={hintDisabled}
            title="Highlights the correct block for the next empty slot — costs points"
            className={`flex w-full items-center justify-center gap-1.5 rounded border py-1.5 font-mono text-[11px] outline-none transition-colors ${
              hintDisabled
                ? "cursor-default border-border text-text-muted opacity-40"
                : "cursor-pointer border-border text-text-muted hover:border-accent hover:text-accent"
            }`}
          >
            <Lightbulb className="h-3 w-3" />
            {hintsUsed > 0 ? `Hint (${hintsUsed} used)` : "Use a hint"}
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col items-center overflow-y-auto p-3">
        <div className="mb-2.5 self-start text-[10px] uppercase tracking-wide text-text-muted">Debug says:</div>

        <div
          className={`relative mb-5 w-full rounded-lg border bg-bubble px-3 py-2.5 text-xs leading-[1.65] text-text transition-colors duration-300 ${MOOD_BORDER[wormMood]}`}
        >
          {wormMessage}
          <div
            className="absolute left-1/2 -bottom-[9px] h-0 w-0 -translate-x-1/2 border-x-8 border-x-transparent border-t-8"
            style={{ borderTopColor: MOOD_TRIANGLE_VAR[wormMood] }}
          />
          <div className="absolute left-1/2 -bottom-[7px] h-0 w-0 -translate-x-1/2 border-x-[7px] border-x-transparent border-t-[7px] border-t-bubble" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <WormCharacter mood={wormMood} />
          <div className="text-[11px] text-text-muted">Debug the Worm</div>
        </div>

        {levelComplete && (
          <button
            onClick={isLastLevel ? undefined : nextLevel}
            className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded border border-accent-green bg-drop-correct-bg py-2.5 font-mono text-[13px] text-accent-green outline-none transition-colors duration-200 ${
              isLastLevel ? "cursor-default" : "cursor-pointer hover:bg-success-hover"
            }`}
          >
            {isLastLevel ? "🏆 All Levels Complete!" : "▶ Next Level"}
          </button>
        )}
      </div>
    </div>
  );
}
