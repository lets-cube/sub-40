import { useSyncExternalStore } from 'react';

import type { ColoredPattern } from '../../content/types';
import type { InteractivePlayback } from '../play-algorithm/model/playback';
import { Formula } from '../play-algorithm/ui/Formula';

export function MoveHistory({
  player,
  patterns,
}: {
  player: InteractivePlayback;
  patterns: readonly ColoredPattern[];
}) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  return (
    <fieldset className="explorer-history formula" aria-label="Historique des coups">
      {state.history.length ? (
        <Formula
          patterns={patterns}
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
