import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { SyntaxText } from './SyntaxText';

export const BLOCK_TYPE = 'CODE_BLOCK';

export interface DragItem {
  blockId: string;
  code: string;
}

interface Props {
  id: string;
  code: string;
}

export function DraggableBlock({ id, code }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: BLOCK_TYPE,
    item: { blockId: id, code },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });
  drag(ref);

  return (
    <div
      ref={ref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 14px',
        borderRadius: '4px',
        background: isDragging ? 'rgba(45,45,45,0.3)' : '#2D2D2D',
        border: `1px solid ${isDragging ? '#555' : '#3E3E3E'}`,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.35 : 1,
        fontFamily: "'Consolas', 'Courier New', monospace",
        fontSize: '13px',
        userSelect: 'none',
        transition: 'background 0.12s, border-color 0.12s, transform 0.12s, box-shadow 0.12s',
        whiteSpace: 'nowrap',
        boxShadow: isDragging ? 'none' : '0 1px 3px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={e => {
        if (!isDragging) {
          (e.currentTarget as HTMLDivElement).style.background = '#37373D';
          (e.currentTarget as HTMLDivElement).style.borderColor = '#4EC9B0';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = '#2D2D2D';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#3E3E3E';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.4)';
      }}
    >
      <SyntaxText code={code} />
    </div>
  );
}
