import { FACE_MOVE_BASES, SLICE_MOVE_BASES, ROTATION_MOVE_BASES } from '../../cube/constants';
export const KEYBOARD_LETTERS = [
  ...FACE_MOVE_BASES,
  ...SLICE_MOVE_BASES,
  ...ROTATION_MOVE_BASES.toUpperCase(),
].join(' ');
export const FACE_COLOR_KEYS: Readonly<Record<string, string>> = {
  U: 'u',
  D: 'd',
  F: 'f',
  B: 'b',
  R: 'r',
  L: 'l',
};
