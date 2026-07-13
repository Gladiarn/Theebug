import { BottomPanel } from "./bottom-panel";
import { EditorArea } from "./editor-area";
import { RightPanel } from "./right-panel";
import { Sidebar } from "./sidebar";
import { Terminal } from "./terminal";

export function GamePlayShell() {
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <EditorArea />
        <Terminal />
        <BottomPanel />
      </div>
      <RightPanel />
    </div>
  );
}
