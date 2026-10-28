import { useEffect } from 'react';

import { invertAlg, moveDescription, parseAlg, sourceNotation } from '../../cube/engine';
import type { AlgorithmCase } from '../../data/method';
import { CubeView } from '../../shared/components/CubeView';
import { Formula } from '../../shared/components/Formula';
import { PlaybackControls } from '../../shared/components/PlaybackControls';
import { useLessonPlayer } from '../../shared/hooks/useLessonPlayer';

export function AlgorithmCard({ data, visible }: { data: AlgorithmCase; visible: boolean }) {
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
            <Formula moves={parseAlg(invertAlg(data.alg))} />
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
