import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameProvider } from './components/GameContext';
import { MenuBar } from './components/MenuBar';
import { Sidebar } from './components/Sidebar';
import { EditorArea } from './components/EditorArea';
import { RightPanel } from './components/RightPanel';
import { BottomPanel } from './components/BottomPanel';
import { Terminal } from './components/Terminal';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GameProvider>
        {/* MARKER-MAKE-KIT-INVOKED */}
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#1E1E1E',
            color: '#CCCCCC',
            fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
            overflow: 'hidden',
          }}
        >
          <MenuBar />

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <Sidebar />

            {/* Center: editor + terminal + choices */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
              <EditorArea />
              <Terminal />
              <BottomPanel />
            </div>

            <RightPanel />
          </div>
        </div>
      </GameProvider>
    </DndProvider>
  );
}
