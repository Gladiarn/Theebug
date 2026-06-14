import { useNavigate, useLocation } from 'react-router';
import { useTheme } from './ThemeContext';
import { useGame } from './GameContext';

export function MenuBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { resetLevel } = useGame();

  const isGame = location.pathname === '/play';

  const navItems = [
    { label: 'Home', action: () => navigate('/') },
    { label: 'Play', action: () => navigate('/play') },
    { label: 'Reset', action: resetLevel, gameOnly: true },
    { label: 'Help', action: undefined },
  ];

  return (
    <div
      style={{
        background: theme.menuBg,
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: theme.text,
        padding: '0 8px',
        flexShrink: 0,
        borderBottom: `1px solid ${theme.border}`,
        userSelect: 'none',
        transition: 'background 0.2s',
      }}
    >
      {/* VS Code icon */}
      <div style={{ width: '22px', marginRight: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="#0078D4" />
          <rect x="9" y="1" width="6" height="6" rx="1" fill="#0078D4" opacity="0.6" />
          <rect x="1" y="9" width="6" height="6" rx="1" fill="#0078D4" opacity="0.6" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="#0078D4" />
        </svg>
      </div>

      {navItems.map(item => {
        if (item.gameOnly && !isGame) return null;
        const isActive =
          (item.label === 'Home' && location.pathname === '/') ||
          (item.label === 'Play' && location.pathname === '/play');

        return (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              background: isActive ? (theme.isDark ? '#505050' : '#CCCCCC') : 'none',
              border: 'none',
              color: theme.text,
              cursor: item.action ? 'pointer' : 'default',
              padding: '0 10px',
              height: '30px',
              fontSize: '12px',
              outline: 'none',
              opacity: item.action ? 1 : 0.5,
            }}
            onMouseEnter={e => {
              if (item.action) (e.currentTarget as HTMLButtonElement).style.background = theme.isDark ? '#505050' : '#CCCCCC';
            }}
            onMouseLeave={e => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            {item.label}
          </button>
        );
      })}

      {/* Center title */}
      <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: theme.textMuted, pointerEvents: 'none' }}>
        Code Canvas — Learn JavaScript by Doing
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={theme.isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        style={{
          background: 'none',
          border: `1px solid ${theme.border}`,
          borderRadius: '4px',
          color: theme.text,
          cursor: 'pointer',
          padding: '2px 8px',
          fontSize: '11px',
          marginRight: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = theme.accent;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = theme.border;
        }}
      >
        {theme.isDark ? '☀️' : '🌙'}
        <span style={{ fontSize: '10px', opacity: 0.8 }}>
          {theme.isDark ? 'Light' : 'Dark'}
        </span>
      </button>

      {/* Window dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((color, i) => (
          <div key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: color }} />
        ))}
      </div>
    </div>
  );
}
