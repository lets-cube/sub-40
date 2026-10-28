import { useCallback, useEffect } from 'react';

import { PATTERNS } from '../data/method';
import { FreeExplorer } from '../features/free-view/FreeExplorer';
import { NotationExplorer } from '../features/notation/NotationExplorer';
import { PatternCard } from '../features/patterns/PatternCard';
import { Dialog } from '../shared/components/Dialog';
import { MODAL_IDS } from '../shared/constants/ui';
import { useAppUi } from '../shared/state/ui-context';
import { DIALOG_TITLES } from './navigation.constants';

export function AppDialogs() {
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
          {PATTERNS.map((p) => (
            <PatternCard key={p.id} pattern={p} />
          ))}
        </div>
      </Dialog>
      <Dialog
        id={MODAL_IDS.freeView}
        title={DIALOG_TITLES[MODAL_IDS.freeView]}
        active={env.modal === MODAL_IDS.freeView}
        onClose={close}
      >
        <FreeExplorer active={env.modal === MODAL_IDS.freeView} />
      </Dialog>
    </>
  );
}
