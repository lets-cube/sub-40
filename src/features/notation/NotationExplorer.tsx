import { useEffect, useState } from 'react';

import { InteractivePlayback } from '../../cube/playback';
import { ArrowToggle } from '../../shared/components/ArrowToggle';
import { ExplorerStatus } from '../../shared/components/ExplorerStatus';
import { InteractiveDrawing } from '../../shared/components/InteractiveDrawing';
import { KeyboardHelp } from '../../shared/components/KeyboardHelp';
import { MoveCommands } from '../../shared/components/MoveCommands';
import { REFERENCE_LINKS } from '../../shared/constants/references';
import { useKeyboardMoves } from '../../shared/hooks/useKeyboardMoves';
import { NOTATION_FAMILIES, type NotationFamilyId } from './notation.constants';

export function NotationExplorer({ active }: { active: boolean }) {
  const [family, setFamily] = useState<NotationFamilyId>('faces');
  const [players] = useState(() =>
    Object.fromEntries(
      NOTATION_FAMILIES.map((f) => [f.id, f.groups.map(() => new InteractivePlayback())]),
    ),
  );
  useEffect(
    () => () => {
      Object.values(players)
        .flat()
        .forEach((p) => p.dispose());
    },
    [players],
  );
  const current = NOTATION_FAMILIES.find((f) => f.id === family)!;
  useKeyboardMoves(
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
        {NOTATION_FAMILIES.map((f) => (
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
      {NOTATION_FAMILIES.map((f) => (
        <div className="notation-family" key={f.id} data-family={f.id} hidden={family !== f.id}>
          {f.groups.map((group, i) => (
            <article className="notation-card interactive-cube" key={group.join('')}>
              <h3>{group.join(' / ')}</h3>
              <InteractiveDrawing player={players[f.id][i]} />
              <MoveCommands bases={group} player={players[f.id][i]} />
              <ExplorerStatus player={players[f.id][i]} />
            </article>
          ))}
        </div>
      ))}
      <div className="notation-bottom">
        <div>
          <KeyboardHelp />
          <a href={REFERENCE_LINKS.notation} target="_blank" rel="noreferrer">
            Référence J Perm
          </a>
        </div>
      </div>
    </>
  );
}
