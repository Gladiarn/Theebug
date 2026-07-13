import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Level } from "@/lib/tracks";

export function LevelCard({ level, trackId }: { level: Level; trackId: string }) {
  return (
    <Link
      href={`/play/${trackId}/${level.id}`}
      className="flex cursor-pointer flex-col overflow-hidden rounded-[10px] border border-border bg-panel shadow-none transition-[border-color,transform,box-shadow] duration-150 hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex items-center justify-between border-b border-border bg-card-header px-3.5 py-3">
        <span className="font-mono text-[11px] text-text-muted">
          0{level.id} — {level.filename}
        </span>
        <span className="rounded-lg border border-border bg-badge-bg px-2 py-0.5 text-[11px] text-accent-yellow">
          {level.title}
        </span>
      </div>
      <div className="flex-1 p-3.5 font-mono text-xs leading-[1.7]">
        {level.codeLines.slice(0, 5).map((line, i) => {
          const hasZone = line.includes("{{");
          const display = line.replace(/\{\{[^}]+\}\}/g, "[ ___ ]");
          return (
            <div key={i} className="flex min-h-[18px] gap-2.5">
              <span className="shrink-0 select-none text-[11px] text-line-num">{i + 1}</span>
              <span
                className={`whitespace-pre ${hasZone ? "text-accent" : "text-text-muted"} ${line === "" ? "opacity-30" : ""}`}
              >
                {display || " "}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border px-3.5 py-2.5 text-[11px] leading-relaxed text-text-muted">
        {level.objective.length > 72 ? level.objective.slice(0, 72) + "…" : level.objective}
      </div>
      <div className="flex items-center justify-end gap-1 border-t border-border px-3.5 py-2.5">
        <span className="font-mono text-xs text-accent">Play</span>
        <ArrowRight className="h-3.5 w-3.5 text-accent" />
      </div>
    </Link>
  );
}
