import { useGame } from './GameContext';
import { LEVELS } from './gameData';
import { DraggableBlock } from './DraggableBlock';

export function BottomPanel() {
  const { currentLevelIndex } = useGame();
  const level = LEVELS[currentLevelIndex];

  return (
    <div
      style={{
        background: '#252526',
        borderTop: '1px solid #3A3A3A',
        flexShrink: 0,
      }}
    >
      {/* Panel header */}
      <div
        style={{
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          borderBottom: '1px solid #3A3A3A',
          gap: '12px',
          fontSize: '12px',
          color: '#CCCCCC',
        }}
      >
        <span
          style={{
            color: '#4EC9B0',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Code Blocks
        </span>
        <span
          style={{
            color: '#888',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4EC9B0',
              display: 'inline-block',
              opacity: 0.7,
            }}
          />
          Drag blocks into the drop zones above
        </span>

        <div style={{ flex: 1 }} />

        <span style={{ color: '#888', fontSize: '11px' }}>
          {level.blocks.length} blocks available
        </span>
      </div>

      {/* Blocks row */}
      <div
        style={{
          padding: '10px 14px 12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
          minHeight: '56px',
        }}
      >
        {level.blocks.map(block => (
          <DraggableBlock key={`${level.id}-${block.id}`} id={block.id} code={block.code} />
        ))}
      </div>
    </div>
  );
}
