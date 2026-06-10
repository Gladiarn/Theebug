import { useGame } from './GameContext';

const MENU_ITEMS = ['File', 'Edit', 'Selection', 'View', 'Run', 'Terminal', 'Help'];

export function MenuBar() {
  const { resetLevel } = useGame();

  return (
    <div
      style={{
        background: '#3C3C3C',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: '#CCCCCC',
        padding: '0 8px',
        flexShrink: 0,
        borderBottom: '1px solid #252526',
        userSelect: 'none',
      }}
    >
      {/* App icon */}
      <div style={{ width: '22px', marginRight: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="#0078D4" />
          <rect x="9" y="1" width="6" height="6" rx="1" fill="#0078D4" opacity="0.6" />
          <rect x="1" y="9" width="6" height="6" rx="1" fill="#0078D4" opacity="0.6" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="#0078D4" />
        </svg>
      </div>

      {MENU_ITEMS.map(item => (
        <button
          key={item}
          onClick={item === 'Run' ? resetLevel : undefined}
          title={item === 'Run' ? 'Reset Current Level' : undefined}
          style={{
            background: 'none',
            border: 'none',
            color: '#CCCCCC',
            cursor: 'pointer',
            padding: '0 8px',
            height: '30px',
            fontSize: '12px',
            outline: 'none',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#505050';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
          }}
        >
          {item}
        </button>
      ))}

      {/* Center title */}
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '12px',
          color: '#9A9A9A',
          pointerEvents: 'none',
        }}
      >
        Code Canvas — Learn JavaScript by Doing
      </div>

      {/* Window controls */}
      <div style={{ display: 'flex', gap: '8px', marginRight: '4px' }}>
        {[{ color: '#FF5F57', label: '−' }, { color: '#FEBC2E', label: '⊡' }, { color: '#28C840', label: '×' }].map(({ color, label }) => (
          <div
            key={label}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}
