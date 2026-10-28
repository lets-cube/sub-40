import { useSyncExternalStore } from 'react';

import type { InteractivePlayback } from '../../cube/playback';
import { useAppUi } from '../state/ui-context';
import { CubeView } from './CubeView';

export function InteractiveDrawing({ player }: { player: InteractivePlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot);
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
