import { useEffect, useRef } from 'react';
import { useGame } from './GameContext';
import { useTheme } from './ThemeContext';

const TABS = ['TERMINAL', 'PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE'];

export function Terminal() {
  const { terminalLogs } = useGame();
  const { theme } = useTheme();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  return (
    <div
      style={{
        height: '110px',
        background: theme.editorBg,
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <div
        style={{
          height: '27px',
          background: theme.panelBg,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}
      >
        {TABS.map((tab, i) => (
          <div
            key={tab}
            style={{
              padding: '0 12px',
              height: '27px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '11px',
              color: i === 0 ? theme.text : theme.textMuted,
              borderBottom: i === 0 ? `1px solid ${theme.text}` : '1px solid transparent',
              cursor: 'pointer',
              userSelect: 'none',
              letterSpacing: '0.03em',
            }}
          >
            {tab}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '10px', color: theme.textMuted, fontSize: '13px' }}>
          <span style={{ cursor: 'pointer' }}>⊕</span>
          <span style={{ cursor: 'pointer' }}>⋮</span>
          <span style={{ cursor: 'pointer' }}>×</span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 12px',
          fontFamily: "'JetBrains Mono', 'Consolas', monospace",
          fontSize: '12px',
          color: theme.text,
        }}
      >
        {terminalLogs.map((log, i) => {
          const isSystem = log.startsWith('[system]');
          const isCorrect = log.includes('✓');
          const isWrong = log.includes('✗');
          return (
            <div key={i} style={{ lineHeight: '1.6', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ color: theme.accent, flexShrink: 0 }}>$</span>
              <span style={{ color: isSystem ? theme.textMuted : isCorrect ? theme.accentGreen : isWrong ? theme.accentRed : theme.text }}>
                {log}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
