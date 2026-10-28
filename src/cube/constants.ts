import type { FaceName } from './types';

export const COLOR_KEYS = ['u', 'l', 'f', 'r', 'b', 'd', 'mask'] as const;
export const COLORS = COLOR_KEYS.map((key) => `var(--cube-${key})`);
export const FACES: Record<FaceName, { n: number[]; p: (r: number, c: number) => number[] }> = {
  Up: { n: [0, 1, 0], p: (r, c) => [c - 1, 1, r - 1] },
  Down: { n: [0, -1, 0], p: (r, c) => [c - 1, -1, 1 - r] },
  Front: { n: [0, 0, 1], p: (r, c) => [c - 1, 1 - r, 1] },
  Back: { n: [0, 0, -1], p: (r, c) => [1 - c, 1 - r, -1] },
  Right: { n: [1, 0, 0], p: (r, c) => [1, 1 - r, 1 - c] },
  Left: { n: [-1, 0, 0], p: (r, c) => [-1, 1 - r, c - 1] },
};

export const FACE_MOVE_BASES = 'RLUDFB';
export const SLICE_MOVE_BASES = 'MES';
export const ROTATION_MOVE_BASES = 'xyz';
export const MOVE_SUFFIXES = ['', "'", '2'] as const;
export const FACE_AXES: Readonly<Record<string, number>> = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };
export const FACE_DIRECTIONS: Readonly<Record<string, number>> = {
  R: -1,
  L: 1,
  U: -1,
  D: 1,
  F: -1,
  B: 1,
};
export const SLICE_AXES: Readonly<Record<string, number>> = { M: 0, E: 1, S: 2 };
export const SLICE_DIRECTIONS: Readonly<Record<string, number>> = { M: 1, E: 1, S: -1 };
export const SOLVED_FACE_COLORS: Readonly<Record<FaceName, number>> = {
  Up: 0,
  Left: 1,
  Front: 2,
  Right: 3,
  Back: 4,
  Down: 5,
};
