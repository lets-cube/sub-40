import { useEffect } from 'react';

import type { Cube3x3Case, ColoredPattern } from '../../content/types';
import {
  invertAlg,
  moveDescription,
  parseAlg,
  sourceNotation,
} from '../../domain/puzzles/cube-3x3/engine';
import { CubeView } from '../../rendering/react/CubeView';
import { useLessonPlayer } from '../play-algorithm/hooks/useLessonPlayer';
import { Formula } from '../play-algorithm/ui/Formula';
import { PlaybackControls } from '../play-algorithm/ui/PlaybackControls';

export function AlgorithmCard({
  data,
  patterns,
  visible,
}: {
  data: Cube3x3Case;
  patterns: readonly ColoredPattern[];
  visible: boolean;
}) {
  const { player, state, environment: env } = useLessonPlayer(data);
  const current = player.moves[state.position];
  useEffect(() => {
    if (!visible) {
      player.pause();
    }
  }, [visible, player]);
  const original = sourceNotation(data.alg);
  const compact = player.moves.join(' ').replaceAll("'", '′');
  return (
    <article className="case-card" data-case={data.id}>
      <header className="case-header">
        <h3>{data.name}</h3>
        <span className="case-label">{data.label}</span>
      </header>
      {data.recognition && <p className="recognition">{data.recognition}</p>}
      <div className="visual">
        <CubeView
          cube={state.cube}
          animation={state.animation}
          move={current}
          arrows={env.arrows}
          previewCamera={data.previewCamera}
        />
        <div className="view-line">
          <span className="view-label">Vue fixe · U en haut · F devant</span>
        </div>
      </div>
      <p className="move-description">{moveDescription(current)}</p>
      <div className="formula-list">
        <div className="formula-option selected">
          <div className="formula-meta">
            <span className="formula-count">
              {state.position} / {player.moves.length} mouvements
            </span>
          </div>
          <div className="formula">
            <Formula
              patterns={patterns}
              moves={player.moves}
              position={state.position}
              onSelect={(i) => {
                env.pauseOthers(player);
                player.seek(i);
              }}
            />
          </div>
          {original !== compact && (
            <details className="source-notation">
              <summary>Écriture Francocube</summary>
              <p>{original}</p>
            </details>
          )}
        </div>
      </div>
      <PlaybackControls player={player} />
      {data.training && (
        <details className="training">
          <summary>Préparer ce cas pour s’entraîner</summary>
          <p>Depuis un cube résolu, appliquez cette formule :</p>
          <div className="formula setup-alg">
            <Formula patterns={patterns} moves={parseAlg(invertAlg(data.alg))} />
          </div>
          <button
            className="outline copy-setup"
            type="button"
            onClick={() => env.copy(invertAlg(data.alg))}
          >
            Copier la préparation
          </button>
        </details>
      )}
    </article>
  );
}
