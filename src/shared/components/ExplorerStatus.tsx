import { useSyncExternalStore } from 'react';

import { fullMoveName } from '../../cube/notation';
import type { InteractivePlayback } from '../../cube/playback';

export function ExplorerStatus({ player }: { player: InteractivePlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot);
  return (
    <p className="explorer-status" aria-live="polite">
      {fullMoveName(state.animation?.move || state.preview || state.lastMove)}
      {state.pending > 0 ? ` · ${state.pending} en attente` : ''}
    </p>
  );
}
