import { useState } from 'react';

import type { ColoredPattern } from '../../content/types';
import { useInteractivePlayer } from '../play-algorithm/hooks/useInteractivePlayer';
import { useKeyboardMoves } from '../play-algorithm/hooks/useKeyboardMoves';
import { ExplorerStatus } from '../play-algorithm/ui/ExplorerStatus';
import { InteractiveDrawing } from '../play-algorithm/ui/InteractiveDrawing';
import { KeyboardHelp } from '../play-algorithm/ui/KeyboardHelp';
import { MoveCommands } from '../play-algorithm/ui/MoveCommands';
import { FREE_VIEW_GROUPS } from './free-view.constants';
import { FreeViewControls } from './FreeViewControls';
import { MoveHistory } from './MoveHistory';
import { SetupForm } from './SetupForm';

export function FreeExplorer({
  active,
  patterns,
}: {
  active: boolean;
  patterns: readonly ColoredPattern[];
}) {
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
          <MoveHistory patterns={patterns} player={player} />
          <ExplorerStatus player={player} />
          <SetupForm player={player} error={error} onError={setError} />
        </div>
      </div>
      <KeyboardHelp />
    </>
  );
}
