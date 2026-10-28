import { useSyncExternalStore } from 'react';

import { useAppUi } from '../../shared/state/ui-context';
import type { InteractivePlayback } from '../play-algorithm/model/playback';
import { ArrowToggle } from '../play-algorithm/ui/ArrowToggle';

export function FreeViewControls({
  player,
  onReset,
}: {
  player: InteractivePlayback;
  onReset: () => void;
}) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  const env = useAppUi();
  return (
    <div className="notation-tools">
      <button
        className="outline"
        type="button"
        disabled={state.busy || !state.history.length}
        onClick={player.clearHistory}
      >
        Effacer
      </button>
      <button
        type="button"
        className="outline"
        disabled={state.busy || !state.cursor}
        onClick={player.undo}
      >
        Annuler
      </button>
      <button
        className="outline"
        type="button"
        disabled={!state.cursor}
        onClick={() => env.copy(player.appliedMoves().join(' '))}
      >
        Copier la suite
      </button>
      <button
        type="button"
        className="outline"
        onClick={() => {
          player.reset();
          onReset();
        }}
      >
        Réinitialiser
      </button>
      <ArrowToggle />
    </div>
  );
}
