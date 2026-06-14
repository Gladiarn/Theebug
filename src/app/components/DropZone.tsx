import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { BLOCK_TYPE, DragItem } from './DraggableBlock';
import { useGame } from './GameContext';
import { useTheme } from './ThemeContext';
import { SyntaxText } from './SyntaxText';

interface Props {
  zoneId: string;
}

export function DropZone({ zoneId }: Props) {
  const { zoneFills, dropBlock } = useGame();
  const { theme } = useTheme();
  const fill = zoneFills[zoneId];
  const ref = useRef<HTMLSpanElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: BLOCK_TYPE,
    drop: item => dropBlock(zoneId, item.code),
    collect: monitor => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });
  drop(ref);

  let bg = theme.dropEmptyBg;
  let border = `1.5px dashed ${theme.dropEmptyBorder}`;
  let content: React.ReactNode = (
    <span style={{ color: theme.accent, opacity: 0.55, letterSpacing: '2px', fontSize: '11px' }}>
      ______
    </span>
  );

  if (fill) {
    bg = fill.correct ? theme.dropCorrectBg : theme.dropWrongBg;
    border = `1.5px solid ${fill.correct ? theme.dropCorrectBorder : theme.dropWrongBorder}`;
    content = <SyntaxText code={fill.code} />;
  }

  if (isOver && canDrop) {
    bg = theme.dropHoverBg;
    border = `1.5px dashed ${theme.accentBlue}`;
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
        fontFamily: "'JetBrains Mono', 'Consolas', monospace",
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
