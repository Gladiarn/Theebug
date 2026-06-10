import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { BLOCK_TYPE, DragItem } from './DraggableBlock';
import { useGame } from './GameContext';
import { SyntaxText } from './SyntaxText';

interface Props {
  zoneId: string;
}

export function DropZone({ zoneId }: Props) {
  const { zoneFills, dropBlock } = useGame();
  const fill = zoneFills[zoneId];
  const ref = useRef<HTMLSpanElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: BLOCK_TYPE,
    drop: item => {
      dropBlock(zoneId, item.code);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  drop(ref);

  let bg = '#2D2D2D';
  let border = '1.5px dashed #4EC9B0';
  let content: React.ReactNode = (
    <span style={{ color: '#4EC9B0', opacity: 0.55, letterSpacing: '2px', fontSize: '11px' }}>
      ______
    </span>
  );

  if (fill) {
    if (fill.correct) {
      bg = '#1E3A2A';
      border = '1.5px solid #6A9955';
    } else {
      bg = '#3A1E1A';
      border = '1.5px solid #F48771';
    }
    content = <SyntaxText code={fill.code} />;
  }

  if (isOver && canDrop) {
    bg = '#2A3A4A';
    border = '1.5px dashed #9CDCFE';
  }

  return (
    <span
      ref={ref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '90px',
        padding: '2px 10px',
        borderRadius: '3px',
        background: bg,
        border,
        fontFamily: "'Consolas', 'Courier New', monospace",
        fontSize: '13px',
        transition: 'background 0.15s, border-color 0.15s',
        verticalAlign: 'middle',
        margin: '0 2px',
        boxSizing: 'border-box',
      }}
    >
      {content}
    </span>
  );
}
