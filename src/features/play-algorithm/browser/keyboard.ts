import {
  FACE_MOVE_BASES,
  SLICE_MOVE_BASES,
  ROTATION_MOVE_BASES,
} from '../../../domain/puzzles/cube-3x3/constants';

const KEYBOARD_MOVE_BASES = FACE_MOVE_BASES + SLICE_MOVE_BASES + ROTATION_MOVE_BASES.toUpperCase();

export function keyboardCommand(
  e: Pick<KeyboardEvent, 'key' | 'code' | 'altKey' | 'shiftKey'>,
  wide = false,
) {
  const plain = e.key.toUpperCase();
  const physical = /^Key([A-Z])$/.exec(e.code || '')?.[1];
  const letter = e.altKey && physical ? physical : plain;
  if (letter.length !== 1 || !KEYBOARD_MOVE_BASES.includes(letter)) {
    return null;
  }
  const base = ROTATION_MOVE_BASES.toUpperCase().includes(letter)
    ? letter.toLowerCase()
    : (e.altKey || wide) && FACE_MOVE_BASES.includes(letter)
      ? letter.toLowerCase()
      : letter;
  return base + (e.shiftKey ? "'" : '');
}
