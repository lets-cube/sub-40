import { useEffect, useState, useSyncExternalStore } from 'react';

import { LessonPlayback } from '../../cube/playback';
import { useAppUi } from '../state/ui-context';

export function useLessonPlayer(data: ConstructorParameters<typeof LessonPlayback>[0]) {
  const [player] = useState(() => new LessonPlayback(data));
  const environment = useAppUi();
  const { register } = environment;
  useEffect(() => {
    const unregister = register(player);
    return () => {
      unregister();
      player.dispose();
    };
  }, [player, register]);
  return { player, state: useSyncExternalStore(player.subscribe, player.getSnapshot), environment };
}
