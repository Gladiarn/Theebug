import { Outlet } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider, useTheme } from './ThemeContext';
import { GameProvider } from './GameContext';
import { MenuBar } from './MenuBar';

function RootLayout() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.editorBg,
        color: theme.text,
        fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
        overflow: 'hidden',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      <MenuBar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
    </div>
  );
}

export function Root() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <GameProvider>
          <RootLayout />
        </GameProvider>
      </DndProvider>
    </ThemeProvider>
  );
}
