import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { invertAlg, moveDescription, parseAlg, sourceNotation } from '../cube/engine';
import { LessonPlayback } from '../cube/playback';
import type { AlgorithmCase, Pattern } from '../data/method';
import { CubeView } from './CubeView';
import { Formula } from './Formula';
import { Icon } from './Icons';
import { useEnvironment } from './Environment';

function useLessonPlayer(data: ConstructorParameters<typeof LessonPlayback>[0]) {
  const [player] = useState(() => new LessonPlayback(data));
  const environment = useEnvironment();
  useEffect(() => {
    const unregister = environment.register(player);
    return () => {
      unregister();
      player.dispose();
    };
  }, [player]);
  return { player, state: useSyncExternalStore(player.subscribe, player.getSnapshot), environment };
}
function PlaybackButtons({ player }: { player: LessonPlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot),
    env = useEnvironment();
  const button = (
    title: string,
    icon: 'play' | 'pause' | 'previous' | 'next' | 'reset',
    action: () => void,
    disabled = false,
    cls = 'icon-button',
  ) => (
    <button
      type="button"
      className={cls}
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={() => {
        env.pauseOthers(player);
        action();
      }}
    >
      <Icon name={icon} />
    </button>
  );
  return (
    <div className="playback">
      {button(
        state.running
          ? 'Mettre en pause'
          : state.position === player.moves.length
            ? 'Rejouer la séquence'
            : 'Lire la séquence',
        state.running ? 'pause' : 'play',
        player.toggle,
        false,
        'play',
      )}
      {button('Mouvement précédent', 'previous', player.previous, state.position === 0)}
      {button('Mouvement suivant', 'next', player.next, state.position === player.moves.length)}
      {button('Réinitialiser la séquence', 'reset', player.reset)}
      <button
        type="button"
        className="copy"
        title="Copier la formule"
        aria-label="Copier la formule"
        onClick={() => env.copy(player.moves.join(' '))}
      >
        <Icon name="copy" />
      </button>
    </div>
  );
}
export function AlgorithmCard({ data, visible }: { data: AlgorithmCase; visible: boolean }) {
  const { player, state, environment: env } = useLessonPlayer(data);
  const current = player.moves[state.position];
  useEffect(() => {
    if (!visible) player.pause();
  }, [visible, player]);
  const original = sourceNotation(data.alg),
    compact = player.moves.join(' ').replaceAll("'", '′');
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
      <PlaybackButtons player={player} />
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
      <PlaybackButtons player={player} />
    </article>
  );
}
