import {
  FACES,
  FACE_AXES,
  FACE_DIRECTIONS,
  SLICE_AXES,
  SLICE_DIRECTIONS,
  SOLVED_FACE_COLORS,
  ROTATION_MOVE_BASES,
  SLICE_MOVE_BASES,
} from './constants';
import { MOVE_NAMES } from './notation.constants';
import type { Cube, FaceMap, FaceName } from './types';

export type { Animation, Cube, FaceMap, FaceName, Sticker } from './types';

export function makeCube(faces: FaceMap): Cube {
  return (Object.entries(FACES) as [FaceName, typeof FACES.Up][]).flatMap(([name, f]) =>
    Array.from({ length: 9 }, (_, i) => ({
      p: f.p(Math.floor(i / 3), i % 3),
      n: [...f.n],
      c: Number(faces[name][i]),
    })),
  );
}
export function parseAlg(text: string): string[] {
  let s = text.replaceAll('′', "'").replace(/([RLUDFB])w/g, (_, f: string) => f.toLowerCase());
  let previous: string;
  do {
    previous = s;
    s = s.replace(/\(([^()]*)\)(\d+)/g, (_, g: string, n: string) => (g + ' ').repeat(Number(n)));
  } while (previous !== s);
  return s.match(/[RLUDFBMESxyzrludfb](?:2'?|'2?|)?/g) || [];
}
const amount = (move: string) => (move.includes('2') ? 2 : move.endsWith("'") ? -1 : 1);
export function lessonMoves(alg: string): string[] {
  const moves: string[] = [];

  for (const raw of parseAlg(alg)) {
    const move = raw.includes('2') ? raw[0] + '2' : raw;
    const last = moves.at(-1);
    if (last && last[0] === move[0]) {
      const count = (((amount(last) + amount(move)) % 4) + 4) % 4;
      moves.pop();
      if (count) {
        moves.push(move[0] + (count === 2 ? '2' : count === 3 ? "'" : ''));
      }
    } else {
      moves.push(move);
    }
  }
  return moves;
}
export function sourceNotation(alg: string) {
  return (alg.match(/[RLUDFBMESxyzrludfb](?:2'?|'2?)?|[()]|\d+/g) || [])
    .join(' ')
    .replace(/\(\s/g, '(')
    .replace(/\s\)/g, ')')
    .replace(/\)\s+(\d+)/g, ')$1')
    .replaceAll("'", '′');
}
export function invertAlg(alg: string) {
  return parseAlg(alg)
    .toReversed()
    .map((m) => (m.includes('2') ? m[0] + '2' : m.endsWith("'") ? m[0] : m + "'"))
    .join(' ');
}
export function moveSpec(move: string, inverse = false) {
  const f = move[0];
  let axis: number;
  let dir: number;
  let layers: number[];
  if (ROTATION_MOVE_BASES.includes(f)) {
    axis = ROTATION_MOVE_BASES.indexOf(f);
    dir = -1;
    layers = [-1, 0, 1];
  } else if (SLICE_MOVE_BASES.includes(f)) {
    axis = SLICE_AXES[f];
    dir = SLICE_DIRECTIONS[f];
    layers = [0];
  } else {
    const face = f.toUpperCase();
    axis = FACE_AXES[face];
    dir = FACE_DIRECTIONS[face];
    const layer = 'RUF'.includes(face) ? 1 : -1;
    layers = f === face ? [layer] : [layer, 0];
  }
  if (move.includes("'")) {
    dir *= -1;
  }
  if (inverse) {
    dir *= -1;
  }
  return { f, axis, dir, layers, angle: ((dir * Math.PI) / 2) * (move.includes('2') ? 2 : 1) };
}
export function rotation(v: number[], axis: number, angle: number): number[] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const [x, y, z] = v;
  return axis === 0
    ? [x, y * c - z * s, y * s + z * c]
    : axis === 1
      ? [x * c + z * s, y, -x * s + z * c]
      : [x * c - y * s, x * s + y * c, z];
}
export function turn(cube: Cube, move: string, inverse = false): Cube {
  const { axis, layers, angle } = moveSpec(move, inverse);
  for (const s of cube) {
    if (layers.includes(s.p[axis])) {
      s.p = rotation(s.p, axis, angle).map(Math.round);
      s.n = rotation(s.n, axis, angle).map(Math.round);
    }
  }
  return cube;
}
export function initialState(c: { faces: FaceMap; alg: string }): Cube {
  const state = makeCube(c.faces);
  parseAlg(c.alg)
    .toReversed()
    .forEach((m) => turn(state, m, true));
  return state;
}
export function solvedCube(): Cube {
  return makeCube(
    Object.fromEntries(
      Object.keys(FACES).map((f) => [f, Array(9).fill(SOLVED_FACE_COLORS[f as FaceName])]),
    ) as FaceMap,
  );
}
export function moveDescription(move: string | null | undefined) {
  if (!move) {
    return 'Séquence terminée';
  }
  return `${move.replaceAll("'", '′')} : ${MOVE_NAMES[move[0]]}, ${move.includes('2') ? 'demi-tour' : move.includes("'") ? 'quart de tour antihoraire' : 'quart de tour horaire'}`;
}
