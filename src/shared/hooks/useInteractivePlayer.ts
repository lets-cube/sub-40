import { useEffect, useState } from 'react';

import { InteractivePlayback } from '../../cube/playback';

export function useInteractivePlayer() {
  const [player] = useState(() => new InteractivePlayback());
  useEffect(() => () => player.dispose(), [player]);
  return player;
}
