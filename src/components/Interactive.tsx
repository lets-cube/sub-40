import { useEffect, useState, useSyncExternalStore } from 'react';

import { fullMoveName, keyboardCommand } from '../cube/notation';
import { InteractivePlayback } from '../cube/playback';
import { useEnvironment } from '../state/environment';
import { CubeView } from './CubeView';
import { Formula } from './Formula';
import { faceStyle } from './move-style';

export function ArrowToggle() {
  const env = useEnvironment();
  return (
    <button
      type="button"
      className="outline arrow-toggle"
      aria-pressed={env.arrows}
      onClick={env.toggleArrows}
    >
      {env.arrows ? 'Masquer l’aide fléchée' : 'Afficher l’aide fléchée'}
    </button>
  );
}
export function KeyboardHelp() {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <p className="notation-footnote">
      Clavier : <span className="keyboard-letters">R L U D F B M E S X Y Z</span> ·{' '}
      <kbd>{mac ? '⇧' : 'Maj'}</kbd> = inverse · <kbd>{mac ? '⌥ Option' : 'Alt'}</kbd> + R/L/U/D/F/B
      = deux couches.
    </p>
  );
}
function useInteractive() {
  const [player] = useState(() => new InteractivePlayback());
  useEffect(() => () => player.dispose(), [player]);
  return player;
}
export function Commands({ bases, player }: { bases: string[]; player: InteractivePlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot);
  return (
    <div className="command-row">
      {bases.flatMap((base) =>
        ['', "'", '2'].map((suffix) => {
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
function InteractiveDrawing({ player }: { player: InteractivePlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot);
  const { arrows } = useEnvironment();
  return (
    <CubeView
      cube={state.cube}
      animation={state.animation}
      move={state.animation?.move || state.preview || state.lastMove}
      arrows={arrows}
    />
  );
}
function ExplorerStatus({ player }: { player: InteractivePlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot);
  return (
    <p className="explorer-status" aria-live="polite">
      {fullMoveName(state.animation?.move || state.preview || state.lastMove)}
      {state.pending > 0 ? ` · ${state.pending} en attente` : ''}
    </p>
  );
}
function useKeyboard(active: boolean, choose: (move: string) => void, wide = false) {
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
const FAMILIES = [
  {
    id: 'faces',
    name: 'Faces',
    groups: [
      ['R', 'L'],
      ['U', 'D'],
      ['F', 'B'],
    ],
  },
  {
    id: 'wide',
    name: 'Doubles couches',
    groups: [
      ['r', 'l'],
      ['u', 'd'],
      ['f', 'b'],
    ],
  },
  { id: 'slices', name: 'M · E · S', groups: [['M'], ['E'], ['S']] },
  { id: 'rotations', name: 'x · y · z', groups: [['x', 'y', 'z']] },
];
export function NotationExplorer({ active }: { active: boolean }) {
  const [family, setFamily] = useState('faces');
  const [players] = useState(() =>
    Object.fromEntries(FAMILIES.map((f) => [f.id, f.groups.map(() => new InteractivePlayback())])),
  );
  useEffect(
    () => () => {
      Object.values(players)
        .flat()
        .forEach((p) => p.dispose());
    },
    [players],
  );
  const current = FAMILIES.find((f) => f.id === family)!;
  useKeyboard(
    active,
    (move) => {
      const index = current.groups.findIndex((group) => group.includes(move[0]));
      if (index >= 0) {
        players[family][index].enqueue(move);
      }
    },
    family === 'wide',
  );
  return (
    <>
      <p className="notation-intro">
        Cliquez plusieurs fois pour enchaîner les mouvements. Chaque cube garde sa position.
      </p>
      <fieldset className="segmented" aria-label="Famille de mouvements">
        {FAMILIES.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={family === f.id}
            onClick={() => setFamily(f.id)}
          >
            {f.name}
          </button>
        ))}
      </fieldset>
      <div className="notation-tools">
        <button
          type="button"
          className="outline"
          onClick={() =>
            Object.values(players)
              .flat()
              .forEach((p) => p.reset())
          }
        >
          Réinitialiser
        </button>
        <ArrowToggle />
      </div>
      <p className="notation-help">
        Le sens horaire se lit en regardant la face concernée. Une minuscule désigne deux couches.
      </p>
      {FAMILIES.map((f) => (
        <div className="notation-family" key={f.id} data-family={f.id} hidden={family !== f.id}>
          {f.groups.map((group, i) => (
            <article className="notation-card interactive-cube" key={group.join('')}>
              <h3>{group.join(' / ')}</h3>
              <InteractiveDrawing player={players[f.id][i]} />
              <Commands bases={group} player={players[f.id][i]} />
              <ExplorerStatus player={players[f.id][i]} />
            </article>
          ))}
        </div>
      ))}
      <div className="notation-bottom">
        <div>
          <KeyboardHelp />
          <a href="https://jperm.net/3x3/moves" target="_blank" rel="noreferrer">
            Référence J Perm
          </a>
        </div>
      </div>
    </>
  );
}
const FREE_GROUPS = [
  { className: 'rotations', title: 'x · y · z', bases: ['x', 'y', 'z'] },
  { className: 'up', title: 'U · Haut', bases: ['U', 'u'] },
  { className: 'back', title: 'B · Arrière', bases: ['B', 'b'] },
  { className: 'slices', title: 'M · E · S', bases: ['M', 'E', 'S'] },
  { className: 'left', title: 'L · Gauche', bases: ['L', 'l'] },
  { className: 'right', title: 'R · Droite', bases: ['R', 'r'] },
  { className: 'front', title: 'F · Avant', bases: ['F', 'f'] },
  { className: 'down', title: 'D · Bas', bases: ['D', 'd'] },
];
export function FreeExplorer({ active }: { active: boolean }) {
  const player = useInteractive();
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot);
  const env = useEnvironment();
  const [setup, setSetup] = useState('');
  const [error, setError] = useState('');
  useKeyboard(active, player.enqueue);
  return (
    <>
      <div className="notation-tools">
        <button
          className="outline"
          type="button"
          disabled={state.busy || !state.history.length}
          onClick={player.clearHistory}
        >
          Effacer
        </button>
        <button
          type="button"
          className="outline"
          disabled={state.busy || !state.cursor}
          onClick={player.undo}
        >
          Annuler
        </button>
        <button
          className="outline"
          type="button"
          disabled={!state.cursor}
          onClick={() => env.copy(player.appliedMoves().join(' '))}
        >
          Copier la suite
        </button>
        <button
          type="button"
          className="outline"
          onClick={() => {
            player.reset();
            setError('');
          }}
        >
          Réinitialiser
        </button>
        <ArrowToggle />
      </div>
      <div id="free-cube" className="interactive-cube">
        <div className="free-stage">
          {FREE_GROUPS.map((group) => (
            <section className={`free-key-group free-${group.className}`} key={group.className}>
              <h3>{group.title}</h3>
              <Commands player={player} bases={group.bases} />
            </section>
          ))}
          <InteractiveDrawing player={player} />
        </div>
        <div className="free-panel">
          <fieldset className="explorer-history formula" aria-label="Historique des coups">
            {state.history.length ? (
              <Formula
                history
                moves={state.history}
                position={state.cursor}
                onSelect={(i) => player.seek(i + 1)}
              />
            ) : (
              <span className="empty-history">Jouez un mouvement pour commencer.</span>
            )}
          </fieldset>
          <ExplorerStatus player={player} />
          <form
            className="setup-form"
            onSubmit={(event) => {
              event.preventDefault();
              try {
                player.applySetup(setup);
                setError('');
              } catch (setupError) {
                setError((setupError as Error).message);
              }
            }}
          >
            <label htmlFor="setup-algorithm">Position de départ</label>
            <div className="setup-input-row">
              <input
                id="setup-algorithm"
                placeholder="R U R′ U′"
                value={setup}
                aria-invalid={!!error}
                aria-describedby={error ? 'setup-error' : undefined}
                onChange={(e) => {
                  setSetup(e.target.value);
                  setError('');
                }}
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit" className="outline">
                Appliquer
              </button>
            </div>
            {error && (
              <p id="setup-error" role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
      <KeyboardHelp />
    </>
  );
}
