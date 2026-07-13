"use client";

import { useDrag } from "react-dnd";
import { SyntaxText } from "./syntax-text";

export const BLOCK_TYPE = "CODE_BLOCK";

export interface DragItem {
  blockId: string;
  code: string;
}

interface Props {
  id: string;
  code: string;
}

export function DraggableBlock({ id, code }: Props) {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: BLOCK_TYPE,
    item: { blockId: id, code },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={(node) => { drag(node); }}
      className={`inline-flex select-none items-center whitespace-nowrap rounded border px-3.5 py-1.5 font-mono text-[13px] transition-[background,border-color,transform,box-shadow] duration-100 ${
        isDragging
          ? "cursor-grabbing border-border bg-transparent opacity-30 shadow-none"
          : "cursor-grab border-block-border bg-block-bg shadow-[var(--shadow-block)] hover:-translate-y-0.5 hover:border-accent hover:bg-block-hover-bg hover:shadow-[var(--shadow-block-hover)]"
      }`}
    >
      <SyntaxText code={code} />
    </div>
  );
}
