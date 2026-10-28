import { useSyncExternalStore } from 'react';

import { MOVE_SUFFIXES } from '../../../domain/puzzles/cube-3x3/constants';
import { fullMoveName } from '../../../domain/puzzles/cube-3x3/notation';
import type { InteractivePlayback } from '../model/playback';
import { faceStyle } from './move-style';

export function MoveCommands({
  bases,
  player,
}: {
  bases: readonly string[];
  player: InteractivePlayback;
}) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  return (
    <div className="command-row">
      {bases.flatMap((base) =>
        MOVE_SUFFIXES.map((suffix) => {
          const move = base + suffix;
          return (
            <button
              type="button"
              key={move}
              data-command={move}
              className={`command-button${state.animation?.move === move ? ' turning' : ''}`}
              style={faceStyle(move)}
              title={fullMoveName(move)}
              aria-label={fullMoveName(move)}
              onClick={() => player.enqueue(move)}
              onMouseEnter={() => player.hover(move)}
              onMouseLeave={() => player.hover(null)}
              onFocus={() => player.hover(move)}
              onBlur={() => player.hover(null)}
            >
              <b>{move.replaceAll("'", '′')}</b>
            </button>
          );
        }),
      )}
    </div>
  );
}
