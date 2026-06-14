import { useGame } from './GameContext';
import { useTheme } from './ThemeContext';
import { LEVELS } from './gameData';
import { DropZone } from './DropZone';
import { SyntaxText } from './SyntaxText';

type Segment =
  | { type: 'text'; content: string }
  | { type: 'zone'; id: string };

function parseLine(line: string): Segment[] {
  const parts = line.split(/(\{\{[^}]+\}\})/);
  return parts.map(part => {
    const m = part.match(/^\{\{([^}]+)\}\}$/);
    if (m) return { type: 'zone' as const, id: m[1] };
    return { type: 'text' as const, content: part };
  });
}

export function EditorArea() {
  const { currentLevelIndex } = useGame();
  const { theme } = useTheme();
  const level = LEVELS[currentLevelIndex];

  return (
    <div style={{ flex: 1, background: theme.editorBg, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.2s' }}>
      {/* Tab bar */}
      <div style={{ background: theme.sidebarBg, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', height: '35px', flexShrink: 0 }}>
        <div
          style={{
            padding: '0 16px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            background: theme.editorBg,
            borderRight: `1px solid ${theme.border}`,
            borderTop: `1px solid ${theme.accentBlue}`,
            fontSize: '13px',
            color: theme.text,
            gap: '8px',
          }}
        >
          <span style={{ color: '#e8bf6a', fontSize: '12px', fontWeight: 'bold' }}>JS</span>
          <span>{level.filename}</span>
          <span style={{ color: theme.textMuted, cursor: 'pointer', fontSize: '14px', padding: '0 3px' }}>×</span>
        </div>
        <div style={{ flex: 1 }} />
      </div>

      {/* Breadcrumb */}
      <div style={{ background: theme.editorBg, borderBottom: `1px solid ${theme.borderLight}`, padding: '3px 16px', fontSize: '12px', color: theme.textMuted, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>CODE_CANVAS</span>
        <span>›</span>
        <span style={{ color: theme.text }}>{level.filename}</span>
      </div>

      {/* Code lines */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0 24px 0', fontFamily: "'JetBrains Mono', 'Consolas', monospace", fontSize: '14px', lineHeight: '1.75' }}>
        {level.codeLines.map((line, lineIdx) => {
          const segments = parseLine(line);

          return (
            <div
              key={lineIdx}
              style={{ display: 'flex', minHeight: '24.5px', alignItems: 'center' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = theme.lineHover; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{ width: '52px', textAlign: 'right', paddingRight: '20px', color: theme.lineNum, userSelect: 'none', flexShrink: 0, fontSize: '13px', fontFamily: 'monospace' }}>
                {lineIdx + 1}
              </div>
              <div style={{ flex: 1, paddingRight: '24px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                {line === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  segments.map((seg, i) =>
                    seg.type === 'zone' ? (
                      <DropZone key={i} zoneId={seg.id} />
                    ) : (
                      <span key={i} style={{ whiteSpace: 'pre' }}>
                        <SyntaxText code={seg.content} />
                      </span>
                    )
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
