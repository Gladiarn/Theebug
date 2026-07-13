"use client";

import { useDrop } from "react-dnd";
import { useGame } from "@/lib/game-context";
import { BLOCK_TYPE, type DragItem } from "./draggable-block";
import { SyntaxText } from "./syntax-text";

interface Props {
  zoneId: string;
}

export function DropZone({ zoneId }: Props) {
  const { zoneFills, dropBlock } = useGame();
  const fill = zoneFills[zoneId];

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: BLOCK_TYPE,
    drop: (item) => dropBlock(zoneId, item.code),
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });

  const stateClass =
    isOver && canDrop
      ? "border-dashed border-accent-blue bg-drop-hover-bg"
      : fill
        ? fill.correct
          ? "border-solid border-drop-correct-border bg-drop-correct-bg"
          : "border-solid border-drop-wrong-border bg-drop-wrong-bg"
        : "border-dashed border-drop-empty-border bg-drop-empty-bg";

  return (
    <span
      ref={(node) => { drop(node); }}
      className={`mx-0.5 box-border inline-flex min-w-[90px] items-center justify-center rounded-[3px] border-[1.5px] px-2.5 py-0.5 align-middle font-mono text-[13px] transition-colors duration-150 ${stateClass}`}
    >
      {fill ? (
        <SyntaxText code={fill.code} />
      ) : (
        <span className="tracking-[2px] text-accent opacity-55">______</span>
      )}
    </span>
  );
}
