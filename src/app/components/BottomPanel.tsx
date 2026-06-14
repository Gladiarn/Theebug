import { useGame } from './GameContext';
import { useTheme } from './ThemeContext';
import { LEVELS } from './gameData';
import { DraggableBlock } from './DraggableBlock';

export function BottomPanel() {
  const { currentLevelIndex } = useGame();
  const { theme } = useTheme();
  const level = LEVELS[currentLevelIndex];

  return (
    <div style={{ background: theme.panelBg, borderTop: `1px solid ${theme.border}`, flexShrink: 0, transition: 'background 0.2s' }}>
      <div
        style={{
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          borderBottom: `1px solid ${theme.border}`,
          gap: '12px',
          fontSize: '12px',
          color: theme.text,
        }}
      >
        <span style={{ color: theme.accent, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Code Blocks
        </span>
        <span style={{ color: theme.textMuted, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: theme.accent, display: 'inline-block', opacity: 0.7 }} />
          Drag blocks into the drop zones above
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ color: theme.textMuted, fontSize: '11px' }}>{level.blocks.length} blocks available</span>
      </div>

      <div style={{ padding: '10px 14px 12px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', minHeight: '56px' }}>
        {level.blocks.map(block => (
          <DraggableBlock key={`${level.id}-${block.id}`} id={block.id} code={block.code} />
        ))}
      </div>
    </div>
  );
}
