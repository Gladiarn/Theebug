"use client";

import { useGame } from "@/lib/game-context";
import { DraggableBlock } from "./draggable-block";

export function BottomPanel() {
  const { currentLevel: level, mistakes } = useGame();

  return (
    <div className="shrink-0 border-t border-border bg-panel transition-colors duration-200">
      <div className="flex h-[30px] items-center gap-3 border-b border-border px-3.5 text-xs text-text">
        <span className="text-[11px] font-bold uppercase tracking-wide text-accent">Code Blocks</span>
        <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
          <span className="inline-block h-[7px] w-[7px] rounded-full bg-accent opacity-70" />
          Drag blocks into the drop zones above
        </span>
        <div className="flex-1" />
        {mistakes > 0 && (
          <span className="text-[11px] text-accent-red">
            {mistakes} mistake{mistakes === 1 ? "" : "s"}
          </span>
        )}
        <span className="text-[11px] text-text-muted">{level.blocks.length} blocks available</span>
      </div>

      <div className="flex min-h-[56px] flex-wrap items-center gap-2 px-3.5 pb-3 pt-2.5">
        {level.blocks.map((block) => (
          <DraggableBlock key={`${level.id}-${block.id}`} id={block.id} code={block.code} />
        ))}
      </div>
    </div>
  );
}
