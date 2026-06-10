import { useGame } from './GameContext';
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
  const level = LEVELS[currentLevelIndex];

  return (
    <div
      style={{
        flex: 1,
        background: '#1E1E1E',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          background: '#252526',
          borderBottom: '1px solid #3A3A3A',
          display: 'flex',
          alignItems: 'center',
          height: '35px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '0 16px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            background: '#1E1E1E',
            borderRight: '1px solid #3A3A3A',
            borderTop: '1px solid #0078D4',
            fontSize: '13px',
            color: '#CCCCCC',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '12px' }}>
            <span style={{ color: '#e8bf6a', fontWeight: 'bold' }}>JS</span>
          </span>
          <span>{level.filename}</span>
          <span
            style={{
              color: '#888',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0 3px',
              lineHeight: 1,
            }}
          >
            ×
          </span>
        </div>
        <div style={{ flex: 1 }} />
      </div>

      {/* Breadcrumb */}
      <div
        style={{
          background: '#1E1E1E',
          borderBottom: '1px solid #2A2A2A',
          padding: '3px 16px',
          fontSize: '12px',
          color: '#888',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span>CODE_CANVAS</span>
        <span>›</span>
        <span style={{ color: '#CCCCCC' }}>{level.filename}</span>
      </div>

      {/* Code lines */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 0 24px 0',
          fontFamily: "'Consolas', 'Courier New', monospace",
          fontSize: '14px',
          lineHeight: '1.75',
        }}
      >
        {level.codeLines.map((line, lineIdx) => {
          const segments = parseLine(line);
          const lineNum = lineIdx + 1;
          const isEmpty = line === '';

          return (
            <div
              key={lineIdx}
              style={{ display: 'flex', minHeight: '24.5px', alignItems: 'center' }}
              className="hover:bg-[#2A2D2E]"
            >
              {/* Line number */}
              <div
                style={{
                  width: '52px',
                  textAlign: 'right',
                  paddingRight: '20px',
                  color: '#4A4A5A',
                  userSelect: 'none',
                  flexShrink: 0,
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              >
                {lineNum}
              </div>

              {/* Code content */}
              <div
                style={{
                  flex: 1,
                  paddingRight: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'nowrap',
                  overflow: 'visible',
                }}
              >
                {isEmpty ? (
                  <span>&nbsp;</span>
                ) : (
                  segments.map((seg, i) => {
                    if (seg.type === 'zone') {
                      return <DropZone key={i} zoneId={seg.id} />;
                    }
                    return (
                      <span key={i} style={{ whiteSpace: 'pre' }}>
                        <SyntaxText code={seg.content} />
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
