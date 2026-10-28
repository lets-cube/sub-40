import type { CSSProperties } from 'react';

const FACE_COLORS: Record<string, string> = { U: 'u', D: 'd', F: 'f', B: 'b', R: 'r', L: 'l' };
export function faceStyle(move: string): CSSProperties {
  const color = FACE_COLORS[move[0].toUpperCase()];
  return {
    '--face-color': color ? `var(--cube-${color})` : 'var(--ink)',
    '--active-ink': color ? 'var(--ink)' : 'var(--paper)',
  } as CSSProperties;
}
