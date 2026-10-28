import { useSyncExternalStore } from 'react';

import { CubeView } from '../../../rendering/react/CubeView';
import { useAppUi } from '../../../shared/state/ui-context';
import type { InteractivePlayback } from '../model/playback';

export function InteractiveDrawing({ player }: { player: InteractivePlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  const { arrows } = useAppUi();
  return (
    <CubeView
      cube={state.cube}
      animation={state.animation}
      move={state.animation?.move || state.preview || state.lastMove}
      arrows={arrows}
    />
  );
}
