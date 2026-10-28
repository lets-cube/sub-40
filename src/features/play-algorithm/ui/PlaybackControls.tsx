import { useSyncExternalStore } from 'react';

import { Icon } from '../../../shared/components/Icon';
import { useAppUi } from '../../../shared/state/ui-context';
import type { LessonPlayback } from '../model/playback';

export function PlaybackControls({ player }: { player: LessonPlayback }) {
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  const env = useAppUi();
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
