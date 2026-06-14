import { useGame } from './GameContext';
import { useTheme } from './ThemeContext';
import { LEVELS } from './gameData';

export function Sidebar() {
  const { currentLevelIndex, completedLevels, goToLevel, score } = useGame();
  const { theme } = useTheme();

  return (
    <div
      style={{
        width: '200px',
        background: theme.sidebarBg,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.border}`,
        fontSize: '12px',
        color: theme.text,
        overflow: 'hidden',
        transition: 'background 0.2s',
      }}
    >
      <div
        style={{
          padding: '8px 12px 6px',
          fontSize: '11px',
          color: theme.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 'bold',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Explorer</span>
        <span style={{ fontSize: '14px', opacity: 0.5 }}>···</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            padding: '5px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: theme.textMuted,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 'bold',
          }}
        >
          <span style={{ fontSize: '9px' }}>▼</span>
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
                background: isActive ? (theme.isDark ? '#37373D' : '#E4E6F1') : 'transparent',
                border: 'none',
                borderLeft: isActive ? `2px solid ${theme.accentBlue}` : '2px solid transparent',
                color: isDone ? theme.accentGreen : isActive ? theme.text : theme.text,
                cursor: 'pointer',
                padding: '5px 8px 5px 20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                outline: 'none',
                opacity: isDone ? 0.85 : 1,
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = theme.lineHover;
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
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.accentBlue, flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          borderTop: `1px solid ${theme.border}`,
          padding: '8px 12px',
          fontSize: '11px',
          color: theme.textMuted,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Completed</span>
          <span style={{ color: theme.accent }}>{completedLevels.length}/{LEVELS.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Score</span>
          <span style={{ color: theme.accentYellow, fontFamily: 'monospace' }}>{score}</span>
        </div>
        <div style={{ height: '3px', background: theme.border, borderRadius: '2px', marginTop: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${(completedLevels.length / LEVELS.length) * 100}%`,
              background: theme.accent,
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
