import { useGame } from './GameContext';
import { LEVELS } from './gameData';

export function Sidebar() {
  const { currentLevelIndex, completedLevels, goToLevel, score } = useGame();

  return (
    <div
      style={{
        width: '200px',
        background: '#252526',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #3A3A3A',
        fontSize: '12px',
        color: '#CCCCCC',
        overflow: 'hidden',
      }}
    >
      {/* Activity bar icons (decorative) */}
      <div
        style={{
          padding: '8px 12px 6px',
          fontSize: '11px',
          color: '#BBBBBB',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 'bold',
          borderBottom: '1px solid #3A3A3A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Explorer</span>
        <span style={{ color: '#888', fontSize: '10px', textTransform: 'none', letterSpacing: 'normal' }}>
          ···
        </span>
      </div>

      {/* Folder section */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            padding: '5px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#CCCCCC',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 'bold',
          }}
        >
          <span style={{ fontSize: '9px', color: '#888' }}>▼</span>
          <span>CODE_CANVAS</span>
        </div>

        {LEVELS.map((level, i) => {
          const isActive = i === currentLevelIndex;
          const isDone = completedLevels.includes(level.id);

          return (
            <button
              key={level.id}
              onClick={() => goToLevel(i)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: isActive ? '#37373D' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '2px solid #0078D4' : '2px solid transparent',
                color: isDone ? '#6A9955' : isActive ? '#FFFFFF' : '#CCCCCC',
                cursor: 'pointer',
                padding: '5px 8px 5px 20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                outline: 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#2A2D2E';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '13px', flexShrink: 0 }}>
                {isDone ? '✅' : isActive ? '📝' : '📄'}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {level.filename}
              </span>
              {isActive && !isDone && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0078D4', flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom status */}
      <div
        style={{
          borderTop: '1px solid #3A3A3A',
          padding: '8px 12px',
          fontSize: '11px',
          color: '#888',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Completed</span>
          <span style={{ color: '#4EC9B0' }}>{completedLevels.length}/{LEVELS.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Score</span>
          <span style={{ color: '#DCDCAA', fontFamily: 'monospace' }}>{score}</span>
        </div>
        <div
          style={{
            height: '3px',
            background: '#3A3A3A',
            borderRadius: '2px',
            marginTop: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(completedLevels.length / LEVELS.length) * 100}%`,
              background: '#4EC9B0',
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
