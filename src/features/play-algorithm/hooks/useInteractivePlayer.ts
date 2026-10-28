import { useEffect, useState } from 'react';

import { browserClock } from '../browser/browser-clock';
import { InteractivePlayback } from '../model/playback';

export function useInteractivePlayer() {
  const [player] = useState(() => new InteractivePlayback(browserClock));
  useEffect(() => () => player.dispose(), [player]);
  return player;
}
