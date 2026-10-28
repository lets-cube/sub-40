import { useSyncExternalStore } from 'react';

import type { InteractivePlayback } from '../../cube/playback';
import { Formula } from '../../shared/components/Formula';

export function MoveHistory({ player }: { player: InteractivePlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot);
  return (
    <fieldset className="explorer-history formula" aria-label="Historique des coups">
      {state.history.length ? (
        <Formula
          history
          moves={state.history}
          position={state.cursor}
          onSelect={(i) => player.seek(i + 1)}
        />
      ) : (
        <span className="empty-history">Jouez un mouvement pour commencer.</span>
      )}
    </fieldset>
  );
}
