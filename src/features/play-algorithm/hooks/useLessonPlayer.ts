import { useEffect, useState, useSyncExternalStore } from 'react';

import { useAppUi } from '../../../shared/state/ui-context';
import { browserClock } from '../browser/browser-clock';
import { LessonPlayback } from '../model/playback';

export function useLessonPlayer(data: ConstructorParameters<typeof LessonPlayback>[0]) {
  const [player] = useState(() => new LessonPlayback(data, browserClock));
  const environment = useAppUi();
  const { register } = environment;
  useEffect(() => {
    const unregister = register(player);
    return () => {
      unregister();
      player.dispose();
    };
  }, [player, register]);
  return {
    player,
    state: useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot),
    environment,
  };
}
