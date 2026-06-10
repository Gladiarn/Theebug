import { useGame, WormMood } from './GameContext';
import { LEVELS } from './gameData';

function WormCharacter({ mood }: { mood: WormMood }) {
  const animMap: Record<WormMood, string> = {
    neutral: 'none',
    happy: 'worm-bounce 0.5s ease-in-out 2',
    sad: 'worm-shake 0.4s ease-in-out 2',
    celebrating: 'worm-wiggle 0.45s ease-in-out infinite alternate',
  };

  const faceMap: Record<WormMood, string> = {
    neutral: '🐛',
    happy: '🐛',
    sad: '😔',
    celebrating: '🎉',
  };

  return (
    <div
      style={{
        fontSize: '52px',
        lineHeight: 1,
        display: 'inline-block',
        animation: animMap[mood],
        transformOrigin: 'center bottom',
        filter: mood === 'celebrating' ? 'drop-shadow(0 0 8px #4EC9B0)' : 'none',
        transition: 'filter 0.3s',
      }}
    >
      {faceMap[mood]}
    </div>
  );
}

export function RightPanel() {
  const {
    currentLevelIndex,
    wormMood,
    wormMessage,
    score,
    completedLevels,
    levelComplete,
    nextLevel,
    zoneFills,
  } = useGame();
  const level = LEVELS[currentLevelIndex];
  const isLastLevel = currentLevelIndex === LEVELS.length - 1;

  const filledCount = level.zones.filter(z => zoneFills[z.id] !== null).length;
  const correctCount = level.zones.filter(z => zoneFills[z.id]?.correct === true).length;

  return (
    <div
      style={{
        width: '265px',
        background: '#252526',
        borderLeft: '1px solid #3A3A3A',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        fontSize: '13px',
        color: '#CCCCCC',
      }}
    >
      <style>{`
        @keyframes worm-wiggle {
          0%   { transform: rotate(-18deg) scale(1.15); }
          100% { transform: rotate(18deg)  scale(1.15); }
        }
        @keyframes worm-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes worm-shake {
          0%, 100% { transform: translateX(0); }
          25%       { transform: translateX(-6px); }
          75%       { transform: translateX(6px); }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #3A3A3A',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#BBBBBB',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Game Panel</span>
        <span style={{ color: '#4EC9B0', fontFamily: 'monospace', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>
          {score} pts
        </span>
      </div>

      {/* Level badge */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #3A3A3A' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Level {level.id} of {LEVELS.length}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: '#DCDCAA',
              background: '#2D2D2D',
              padding: '1px 7px',
              borderRadius: '10px',
              border: '1px solid #3A3A3A',
            }}
          >
            {level.title}
          </span>
        </div>

        {/* Zone fill progress */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
          {level.zones.map(z => {
            const fill = zoneFills[z.id];
            return (
              <div
                key={z.id}
                style={{
                  height: '5px',
                  flex: 1,
                  borderRadius: '3px',
                  background: fill
                    ? fill.correct
                      ? '#6A9955'
                      : '#F48771'
                    : '#3A3A3A',
                  transition: 'background 0.3s',
                }}
              />
            );
          })}
        </div>
        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
          {correctCount}/{level.zones.length} slots filled correctly
        </div>
      </div>

      {/* Objective */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #3A3A3A' }}>
        <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
          Objective
        </div>
        <div style={{ color: '#CCCCCC', lineHeight: '1.55', fontSize: '12px' }}>{level.objective}</div>
      </div>

      {/* Expected output */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #3A3A3A' }}>
        <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
          Expected Output
        </div>
        <div
          style={{
            background: '#1E1E1E',
            borderRadius: '4px',
            padding: '8px 10px',
            fontFamily: 'monospace',
            fontSize: '12px',
            border: '1px solid #3A3A3A',
          }}
        >
          {level.preview.map((line, i) => (
            <div key={i} style={{ color: '#CE9178' }}>{line}</div>
          ))}
        </div>
      </div>

      {/* Worm + speech bubble */}
      <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', alignSelf: 'flex-start' }}>
          Debug says:
        </div>

        {/* Speech bubble */}
        <div
          style={{
            background: '#2D2D2D',
            border: `1px solid ${wormMood === 'sad' ? '#F48771' : wormMood === 'celebrating' ? '#6A9955' : '#4EC9B0'}`,
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '20px',
            position: 'relative',
            fontSize: '12px',
            lineHeight: '1.65',
            color: '#CCCCCC',
            width: '100%',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s',
          }}
        >
          {wormMessage}
          {/* Tail pointing down to worm */}
          <div
            style={{
              position: 'absolute',
              bottom: '-9px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: `8px solid ${wormMood === 'sad' ? '#F48771' : wormMood === 'celebrating' ? '#6A9955' : '#4EC9B0'}`,
              transition: 'border-top-color 0.3s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-7px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '7px solid #2D2D2D',
            }}
          />
        </div>

        {/* Worm avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <WormCharacter mood={wormMood} />
          <div style={{ fontSize: '11px', color: '#888' }}>Debug the Worm</div>
        </div>

        {/* Next level / complete button */}
        {levelComplete && (
          <button
            onClick={nextLevel}
            disabled={isLastLevel && completedLevels.length === LEVELS.length}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '9px',
              background: isLastLevel ? '#1E3A1E' : '#1E3A2A',
              border: `1px solid ${isLastLevel ? '#4EC9B0' : '#6A9955'}`,
              borderRadius: '4px',
              color: isLastLevel ? '#4EC9B0' : '#6A9955',
              cursor: isLastLevel ? 'default' : 'pointer',
              fontSize: '13px',
              fontFamily: 'monospace',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => {
              if (!isLastLevel) (e.currentTarget as HTMLButtonElement).style.background = '#2A5A3A';
            }}
            onMouseLeave={e => {
              if (!isLastLevel) (e.currentTarget as HTMLButtonElement).style.background = '#1E3A2A';
            }}
          >
            {isLastLevel ? '🏆 All Levels Complete!' : '▶ Next Level'}
          </button>
        )}
      </div>
    </div>
  );
}
