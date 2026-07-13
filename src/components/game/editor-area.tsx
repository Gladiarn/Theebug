"use client";

import { useGame } from "@/lib/game-context";
import { DropZone } from "./drop-zone";
import { SyntaxText } from "./syntax-text";

type Segment = { type: "text"; content: string } | { type: "zone"; id: string };

function parseLine(line: string): Segment[] {
  return line.split(/(\{\{[^}]+\}\})/).map((part) => {
    const m = part.match(/^\{\{([^}]+)\}\}$/);
    return m ? { type: "zone" as const, id: m[1] } : { type: "text" as const, content: part };
  });
}

const FILE_BADGE: Record<string, string> = { js: "JS", html: "HTML", css: "CSS" };

function fileBadge(filename: string): string {
  const ext = filename.split(".").pop() ?? "";
  return FILE_BADGE[ext] ?? ext.toUpperCase();
}

export function EditorArea() {
  const { currentLevel: level } = useGame();

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-bg transition-colors duration-200">
      <div className="flex h-[35px] shrink-0 items-center border-b border-border bg-sidebar">
        <div className="flex h-full items-center gap-2 border-r border-border border-t-2 border-t-accent-blue bg-bg px-4 text-[13px]">
          <span className="text-xs font-bold text-accent-yellow">{fileBadge(level.filename)}</span>
          <span>{level.filename}</span>
          <span className="cursor-pointer px-[3px] text-sm text-text-muted">×</span>
        </div>
        <div className="flex-1" />
      </div>

      <div className="flex shrink-0 items-center gap-1 border-b border-border-light bg-bg px-4 py-[3px] text-xs text-text-muted">
        <span>THEEBUG</span>
        <span>›</span>
        <span className="text-text">{level.filename}</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 pb-6 font-mono text-sm leading-[1.75]">
        {level.codeLines.map((line, lineIdx) => {
          const segments = parseLine(line);
          return (
            <div key={lineIdx} className="flex min-h-[24.5px] items-center hover:bg-line-hover">
              <div className="w-[52px] shrink-0 select-none pr-5 text-right font-mono text-[13px] text-line-num">
                {lineIdx + 1}
              </div>
              <div className="flex flex-1 flex-nowrap items-center pr-6">
                {line === "" ? (
                  <span>&nbsp;</span>
                ) : (
                  segments.map((seg, i) =>
                    seg.type === "zone" ? (
                      <DropZone key={i} zoneId={seg.id} />
                    ) : (
                      <span key={i} className="whitespace-pre">
                        <SyntaxText code={seg.content} />
                      </span>
                    ),
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
