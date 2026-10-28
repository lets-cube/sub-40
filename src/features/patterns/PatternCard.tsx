import type { CSSProperties } from 'react';

import { moveDescription } from '../../cube/engine';
import type { Pattern } from '../../data/method';
import { CubeView } from '../../shared/components/CubeView';
import { Formula } from '../../shared/components/Formula';
import { PlaybackControls } from '../../shared/components/PlaybackControls';
import { useLessonPlayer } from '../../shared/hooks/useLessonPlayer';

export function PatternCard({ pattern }: { pattern: Pattern }) {
  const {
    player,
    state,
    environment: env,
  } = useLessonPlayer({ alg: pattern.alg, startSolved: true });
  return (
    <article
      className="pattern-card"
      data-pattern-card={pattern.id}
      style={{ '--motif-color': pattern.color, '--motif-bg': pattern.background } as CSSProperties}
    >
      <h3>{pattern.name}</h3>
      <div className="visual">
        <CubeView
          cube={state.cube}
          animation={state.animation}
          move={player.moves[state.position]}
          arrows={env.arrows}
        />
        <div className="view-line">
          <span className="view-label">Vue fixe · U en haut · F devant</span>
        </div>
      </div>
      <p className="move-description">{moveDescription(player.moves[state.position])}</p>
      <div className="formula-list">
        <div className="formula-meta">
          <span className="formula-count">
            {state.position} / {player.moves.length} mouvements
          </span>
        </div>
        <div className="formula">
          <Formula
            moves={player.moves}
            position={state.position}
            onSelect={(i) => {
              env.pauseOthers(player);
              player.seek(i);
            }}
          />
        </div>
      </div>
      <PlaybackControls player={player} />
    </article>
  );
}
