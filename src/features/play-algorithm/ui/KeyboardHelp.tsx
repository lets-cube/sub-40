import { KEYBOARD_LETTERS } from './moves.constants';

export function KeyboardHelp() {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <p className="notation-footnote">
      Clavier : <span className="keyboard-letters">{KEYBOARD_LETTERS}</span> ·{' '}
      <kbd>{mac ? '⇧' : 'Maj'}</kbd> = inverse · <kbd>{mac ? '⌥ Option' : 'Alt'}</kbd> + R/L/U/D/F/B
      = deux couches.
    </p>
  );
}
