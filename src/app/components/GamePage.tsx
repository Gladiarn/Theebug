import { Sidebar } from './Sidebar';
import { EditorArea } from './EditorArea';
import { RightPanel } from './RightPanel';
import { BottomPanel } from './BottomPanel';
import { Terminal } from './Terminal';

export function GamePage() {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <EditorArea />
        <Terminal />
        <BottomPanel />
      </div>
      <RightPanel />
    </div>
  );
}
