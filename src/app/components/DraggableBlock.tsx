import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { SyntaxText } from './SyntaxText';
import { useTheme } from './ThemeContext';

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
  const { theme } = useTheme();
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
        background: isDragging ? 'transparent' : theme.blockBg,
        border: `1px solid ${isDragging ? theme.border : theme.blockBorder}`,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.3 : 1,
        fontFamily: "'JetBrains Mono', 'Consolas', monospace",
        fontSize: '13px',
        userSelect: 'none',
        transition: 'background 0.12s, border-color 0.12s, transform 0.12s, box-shadow 0.12s',
        whiteSpace: 'nowrap',
        boxShadow: isDragging ? 'none' : `0 1px 3px rgba(0,0,0,${theme.isDark ? 0.4 : 0.12})`,
      }}
      onMouseEnter={e => {
        if (!isDragging) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = theme.blockHoverBg;
          el.style.borderColor = theme.accent;
          el.style.transform = 'translateY(-2px)';
          el.style.boxShadow = `0 4px 10px rgba(0,0,0,${theme.isDark ? 0.5 : 0.18})`;
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = theme.blockBg;
        el.style.borderColor = theme.blockBorder;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = `0 1px 3px rgba(0,0,0,${theme.isDark ? 0.4 : 0.12})`;
      }}
    >
      <SyntaxText code={code} />
    </div>
  );
}
