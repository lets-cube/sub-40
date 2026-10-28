import { useCallback, useEffect } from 'react';

import type { ColoredPattern } from '../content/types';
import { FreeExplorer } from '../features/explore-puzzle/FreeExplorer';
import { PatternCard } from '../features/learn-patterns/PatternCard';
import { NotationExplorer } from '../features/understand-notation/NotationExplorer';
import { Dialog } from '../shared/components/Dialog';
import { MODAL_IDS } from '../shared/constants/ui';
import { useAppUi } from '../shared/state/ui-context';
import { DIALOG_TITLES } from './navigation.constants';

export function AppDialogs({ patterns }: { patterns: readonly ColoredPattern[] }) {
  const env = useAppUi();
  const { open } = env;
  const close = useCallback(() => open(null), [open]);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (env.modal) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = previous;
    };
  }, [env.modal]);
  return (
    <>
      <Dialog
        id={MODAL_IDS.notation}
        title={DIALOG_TITLES[MODAL_IDS.notation]}
        active={env.modal === MODAL_IDS.notation}
        onClose={close}
      >
        <NotationExplorer active={env.modal === MODAL_IDS.notation} />
        <div className="notation-bottom">
          <button type="button" className="outline" onClick={() => env.open(MODAL_IDS.freeView)}>
            Vue libre
          </button>
        </div>
      </Dialog>
      <Dialog
        id={MODAL_IDS.patterns}
        title={DIALOG_TITLES[MODAL_IDS.patterns]}
        active={env.modal === MODAL_IDS.patterns}
        onClose={close}
      >
        <p className="notation-intro">Des motifs communs à beaucoup d’algorithmes.</p>
        <div className="patterns-grid">
          {patterns.map((p) => (
            <PatternCard key={p.id} pattern={p} patterns={patterns} />
          ))}
        </div>
      </Dialog>
      <Dialog
        id={MODAL_IDS.freeView}
        title={DIALOG_TITLES[MODAL_IDS.freeView]}
        active={env.modal === MODAL_IDS.freeView}
        onClose={close}
      >
        <FreeExplorer patterns={patterns} active={env.modal === MODAL_IDS.freeView} />
      </Dialog>
    </>
  );
}
