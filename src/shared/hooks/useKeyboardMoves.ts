import { useEffect } from 'react';

import { keyboardCommand } from '../../cube/notation';

export function useKeyboardMoves(active: boolean, choose: (move: string) => void, wide = false) {
  useEffect(() => {
    if (!active) {
      return;
    }
    const handle = (event: KeyboardEvent) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.isComposing ||
        (event.target instanceof HTMLElement &&
          event.target.closest('input,textarea,select,[contenteditable="true"]'))
      ) {
        return;
      }
      const move = keyboardCommand(event, wide);
      if (move) {
        event.preventDefault();
        choose(move);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [active, choose, wide]);
}
