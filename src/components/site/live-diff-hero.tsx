"use client";

import { useEffect, useState } from "react";
import { SyntaxText } from "@/components/game/syntax-text";

interface DiffSnippet {
  filename: string;
  before: string;
  prefix: string;
  answer: string;
  suffix: string;
  after: string;
}

const SNIPPETS: DiffSnippet[] = [
  { filename: "lesson2.js", before: "function add(a, b) {", prefix: "  return ", answer: "a + b", suffix: ";", after: "}" },
  { filename: "lesson1.css", before: "p {", prefix: "  color: ", answer: "teal", suffix: ";", after: "}" },
  {
    filename: "lesson3.html",
    before: "<!-- profile.html -->",
    prefix: '<img src="',
    answer: "worm.png",
    suffix: '" alt="Debug" />',
    after: "",
  },
];

type Phase = "blank" | "drop" | "resolved";
const NEXT_PHASE: Record<Phase, Phase> = { blank: "drop", drop: "resolved", resolved: "blank" };
const TIMINGS: Record<Phase, number> = { blank: 1100, drop: 650, resolved: 2200 };

export function LiveDiffHero() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("blank");
  const [reducedMotion, setReducedMotion] = useState(false);

  // matchMedia only exists client-side; reading it during render would mismatch
  // the server-rendered markup, so this one-time read has to happen in an effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => {
      if (phase === "resolved") setIndex((i) => (i + 1) % SNIPPETS.length);
      setPhase(NEXT_PHASE[phase]);
    }, TIMINGS[phase]);
    return () => clearTimeout(timer);
  }, [phase, reducedMotion]);

  const snippet = SNIPPETS[index];
  const shown: Phase = reducedMotion ? "resolved" : phase;

  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-[10px] border border-border bg-bg font-mono text-[13px] shadow-[var(--shadow-elevated)]">
      <div className="flex items-center gap-1.5 border-b border-border bg-panel px-3.5 py-2.5">
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} className="h-[11px] w-[11px] rounded-full" style={{ background: c }} />
        ))}
        <span className="flex-1 text-center text-[11px] text-text-muted">{snippet.filename}</span>
      </div>

      <div className="relative px-2 py-6">
        {shown === "drop" && (
          <span className="chip-drop absolute right-6 top-2 z-10 rounded border border-block-border bg-block-bg px-2.5 py-1 text-xs shadow-[var(--shadow-block)]">
            <SyntaxText code={snippet.answer} />
          </span>
        )}

        <div className="flex items-center gap-3 px-3 leading-[1.9]">
          <span className="w-4 shrink-0 text-right text-xs text-line-num">1</span>
          <span className="whitespace-pre text-code-plain">{snippet.before}</span>
        </div>

        <div
          className={`flex items-center gap-3 rounded px-3 leading-[1.9] ${shown === "resolved" ? "diff-flash" : ""}`}
        >
          <span
            className={`w-4 shrink-0 text-right text-xs ${shown === "resolved" ? "font-bold text-accent-green" : "text-line-num"}`}
          >
            {shown === "resolved" ? "+" : "2"}
          </span>
          <span className="whitespace-pre text-code-plain">{snippet.prefix}</span>

          {shown === "resolved" ? (
            <span className="rounded-[3px] border-[1.5px] border-drop-correct-border bg-drop-correct-bg px-2 py-0.5">
              <SyntaxText code={snippet.answer} />
            </span>
          ) : (
            <span
              className={`inline-flex min-w-[64px] items-center justify-center rounded-[3px] border-[1.5px] border-dashed px-2 py-0.5 text-accent opacity-70 transition-colors duration-200 ${
                shown === "drop" ? "border-accent-blue" : "border-drop-empty-border"
              }`}
            >
              ______
            </span>
          )}

          <span className="whitespace-pre text-code-plain">{snippet.suffix}</span>
        </div>

        {snippet.after && (
          <div className="flex items-center gap-3 px-3 leading-[1.9]">
            <span className="w-4 shrink-0 text-right text-xs text-line-num">3</span>
            <span className="whitespace-pre text-code-plain">{snippet.after}</span>
          </div>
        )}
      </div>
    </div>
  );
}
