import { useEffect, useRef } from 'react';
import { useGame } from './GameContext';

const TABS = ['TERMINAL', 'PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE'];

export function Terminal() {
  const { terminalLogs } = useGame();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  return (
    <div
      style={{
        height: '110px',
        background: '#1E1E1E',
        borderTop: '1px solid #3A3A3A',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Tab strip */}
      <div
        style={{
          height: '27px',
          background: '#252526',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: '0',
          borderBottom: '1px solid #3A3A3A',
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
              color: i === 0 ? '#CCCCCC' : '#777',
              borderBottom: i === 0 ? '1px solid #CCCCCC' : '1px solid transparent',
              cursor: 'pointer',
              userSelect: 'none',
              letterSpacing: '0.03em',
            }}
          >
            {tab}
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {/* Decorative icons */}
        <div style={{ display: 'flex', gap: '10px', color: '#888', fontSize: '13px' }}>
          <span style={{ cursor: 'pointer' }}>⊕</span>
          <span style={{ cursor: 'pointer' }}>⋮</span>
          <span style={{ cursor: 'pointer' }}>×</span>
        </div>
      </div>

      {/* Terminal output */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 12px 4px',
          fontFamily: "'Consolas', 'Courier New', monospace",
          fontSize: '12px',
          color: '#CCCCCC',
        }}
      >
        {terminalLogs.map((log, i) => {
          const isSystem = log.startsWith('[system]');
          const isDrop = log.startsWith('[drop]');
          const isCorrect = log.includes('✓');
          const isWrong = log.includes('✗');

          return (
            <div key={i} style={{ lineHeight: '1.6', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ color: '#4EC9B0', flexShrink: 0 }}>$</span>
              <span
                style={{
                  color: isSystem
                    ? '#888'
                    : isCorrect
                    ? '#6A9955'
                    : isWrong
                    ? '#F48771'
                    : '#CCCCCC',
                }}
              >
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
