import { FACE_MOVE_BASES, SLICE_MOVE_BASES, ROTATION_MOVE_BASES } from './constants';
import { FULL_MOVE_NAMES, SETUP_LIMITS } from './notation.constants';

const KEYBOARD_MOVE_BASES = FACE_MOVE_BASES + SLICE_MOVE_BASES + ROTATION_MOVE_BASES.toUpperCase();

export function fullMoveName(move?: string | null) {
  if (!move) {
    return 'Cube résolu';
  }
  return `${move.replaceAll("'", '′')} — ${FULL_MOVE_NAMES[move[0]]}${move.includes('2') ? ' · demi-tour' : move.includes("'") ? ' · sens inverse' : ''}`;
}
// Strict, bounded parsing for user-entered setups; never apply a partial formula.
export function parseSetupAlg(text: string) {
  const source = text.replace(/[′’]/g, "'");
  let index = 0;
  function skip() {
    while (/\s/.test(source[index] || '') && index < source.length) {
      index++;
    }
  }
  function sequence(depth = 0): string[] {
    if (depth > SETUP_LIMITS.maxDepth) {
      throw new Error('Trop de parenthèses imbriquées.');
    }
    const moves: string[] = [];
    while (index < source.length) {
      skip();
      if (index >= source.length || source[index] === ')') {
        break;
      }
      if (source[index] === '(') {
        index++;
        const group = sequence(depth + 1);
        skip();
        if (source[index] !== ')') {
          throw new Error('Il manque une parenthèse fermante.');
        }
        index++;
        const repeat = source.slice(index).match(/^\d+/);
        const count = repeat ? Number(repeat[0]) : 1;
        if (repeat) {
          index += repeat[0].length;
        }
        if (
          !group.length ||
          count < 1 ||
          count > SETUP_LIMITS.maxRepeat ||
          moves.length + group.length * count > SETUP_LIMITS.maxMoves
        ) {
          throw new Error('La formule doit contenir de 1 à 500 mouvements.');
        }
        for (let i = 0; i < count; i++) {
          moves.push(...group);
        }
      } else {
        const token = source
          .slice(index)
          .match(/^(?:[RLUDFB]w|[RLUDFBMESxyzXYZrludfb])(?:2'?|'2?)?/);
        if (!token) {
          throw new Error(`Notation inconnue près de « ${source.slice(index, index + 10)} ».`);
        }
        index += token[0].length;
        let move = token[0]
          .replace(/([RLUDFB])w/, (_, f) => f.toLowerCase())
          .replace(/^[XYZ]/, (f) => f.toLowerCase());
        if (move.includes('2')) {
          move = move[0] + '2';
        }
        moves.push(move);
        if (moves.length > SETUP_LIMITS.maxMoves) {
          throw new Error('La formule est limitée à 500 mouvements.');
        }
      }
    }
    return moves;
  }
  const moves = sequence();
  skip();
  if (index !== source.length) {
    throw new Error('Parenthèse fermante en trop.');
  }
  if (!moves.length) {
    throw new Error('Saisissez une formule, par exemple R U R′ U′.');
  }
  return moves;
}
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
