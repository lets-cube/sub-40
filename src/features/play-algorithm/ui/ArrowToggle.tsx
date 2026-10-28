import { useAppUi } from '../../../shared/state/ui-context';

export function ArrowToggle() {
  const env = useAppUi();
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
