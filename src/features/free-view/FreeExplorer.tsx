import { useState } from 'react';

import { ExplorerStatus } from '../../shared/components/ExplorerStatus';
import { InteractiveDrawing } from '../../shared/components/InteractiveDrawing';
import { KeyboardHelp } from '../../shared/components/KeyboardHelp';
import { MoveCommands } from '../../shared/components/MoveCommands';
import { useInteractivePlayer } from '../../shared/hooks/useInteractivePlayer';
import { useKeyboardMoves } from '../../shared/hooks/useKeyboardMoves';
import { FREE_VIEW_GROUPS } from './free-view.constants';
import { FreeViewControls } from './FreeViewControls';
import { MoveHistory } from './MoveHistory';
import { SetupForm } from './SetupForm';

export function FreeExplorer({ active }: { active: boolean }) {
  const player = useInteractivePlayer();
  const [error, setError] = useState('');
  useKeyboardMoves(active, player.enqueue);
  return (
    <>
      <FreeViewControls player={player} onReset={() => setError('')} />
      <div id="free-cube" className="interactive-cube">
        <div className="free-stage">
          {FREE_VIEW_GROUPS.map((group) => (
            <section className={`free-key-group free-${group.className}`} key={group.className}>
              <h3>{group.title}</h3>
              <MoveCommands player={player} bases={group.bases} />
            </section>
          ))}
          <InteractiveDrawing player={player} />
        </div>
        <div className="free-panel">
          <MoveHistory player={player} />
          <ExplorerStatus player={player} />
          <SetupForm player={player} error={error} onError={setError} />
        </div>
      </div>
      <KeyboardHelp />
    </>
  );
}
