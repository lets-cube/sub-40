import type { CSSProperties } from 'react';

import { FACE_COLOR_KEYS } from './moves.constants';

export function faceStyle(move: string): CSSProperties {
  const color = FACE_COLOR_KEYS[move[0].toUpperCase()];
  return {
    '--face-color': color ? `var(--cube-${color})` : 'var(--ink)',
    '--active-ink': color ? 'var(--ink)' : 'var(--paper)',
  } as CSSProperties;
}
