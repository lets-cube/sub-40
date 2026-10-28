/** Fixed sticker coordinates. Cameras never change the meaning of R/L, U/D or F/B. */
export type Camera = 'front' | 'back';
export type FaceName = 'Up' | 'Down' | 'Front' | 'Back' | 'Right' | 'Left';
export type FaceMap = Record<FaceName, (number | string)[]>;
export interface Sticker {
  p: number[];
  n: number[];
  c: number;
}
export type Cube = Sticker[];
export interface Animation {
  move: string;
  inverse: boolean;
  progress: number;
}
export const COLORS = [
  'var(--cube-u)',
  'var(--cube-l)',
  'var(--cube-f)',
  'var(--cube-r)',
  'var(--cube-b)',
  'var(--cube-d)',
  'var(--cube-mask)',
];
export const FACES: Record<FaceName, { n: number[]; p: (r: number, c: number) => number[] }> = {
  Up: { n: [0, 1, 0], p: (r, c) => [c - 1, 1, r - 1] },
  Down: { n: [0, -1, 0], p: (r, c) => [c - 1, -1, 1 - r] },
  Front: { n: [0, 0, 1], p: (r, c) => [c - 1, 1 - r, 1] },
  Back: { n: [0, 0, -1], p: (r, c) => [1 - c, 1 - r, -1] },
  Right: { n: [1, 0, 0], p: (r, c) => [1, 1 - r, 1 - c] },
  Left: { n: [-1, 0, 0], p: (r, c) => [-1, 1 - r, c - 1] },
};
const MOVE_NAMES: Record<string, string> = {
  R: 'face droite',
  L: 'face gauche',
  U: 'face du haut',
  D: 'face du bas',
  F: 'face avant',
  B: 'face arrière',
  r: 'deux couches de droite',
  l: 'deux couches de gauche',
  u: 'deux couches du haut',
  d: 'deux couches du bas',
  f: 'deux couches avant',
  b: 'deux couches arrière',
  M: 'tranche centrale verticale',
  E: 'tranche centrale horizontale',
  S: 'tranche centrale parallèle à F',
  x: 'cube entier, axe R',
  y: 'cube entier, axe U',
  z: 'cube entier, axe F',
};
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
  let s = text.replaceAll('′', "'").replace(/([RLUDFB])w/g, (_, f: string) => f.toLowerCase()),
    previous: string;
  do {
    previous = s;
    s = s.replace(/\(([^()]*)\)(\d+)/g, (_, g: string, n: string) => (g + ' ').repeat(Number(n)));
  } while (previous !== s);
  return s.match(/[RLUDFBMESxyzrludfb](?:2'?|'2?|)?/g) || [];
}
export function lessonMoves(alg: string): string[] {
  const moves: string[] = [];
  const amount = (m: string) => (m.includes('2') ? 2 : m.endsWith("'") ? -1 : 1);
  for (const raw of parseAlg(alg)) {
    const move = raw.includes('2') ? raw[0] + '2' : raw,
      last = moves.at(-1);
    if (last && last[0] === move[0]) {
      const count = (((amount(last) + amount(move)) % 4) + 4) % 4;
      moves.pop();
      if (count) moves.push(move[0] + (count === 2 ? '2' : count === 3 ? "'" : ''));
    } else moves.push(move);
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
    .reverse()
    .map((m) => (m.includes('2') ? m[0] + '2' : m.endsWith("'") ? m[0] : m + "'"))
    .join(' ');
}
export function moveSpec(move: string, inverse = false) {
  const f = move[0];
  let axis: number, dir: number, layers: number[];
  const axes: Record<string, number> = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 },
    dirs: Record<string, number> = { R: -1, L: 1, U: -1, D: 1, F: -1, B: 1 };
  if ('xyz'.includes(f)) {
    axis = 'xyz'.indexOf(f);
    dir = -1;
    layers = [-1, 0, 1];
  } else if ('MES'.includes(f)) {
    axis = ({ M: 0, E: 1, S: 2 } as Record<string, number>)[f];
    dir = ({ M: 1, E: 1, S: -1 } as Record<string, number>)[f];
    layers = [0];
  } else {
    const face = f.toUpperCase();
    axis = axes[face];
    dir = dirs[face];
    const layer = 'RUF'.includes(face) ? 1 : -1;
    layers = f === face ? [layer] : [layer, 0];
  }
  if (move.includes("'")) dir *= -1;
  if (inverse) dir *= -1;
  return { f, axis, dir, layers, angle: ((dir * Math.PI) / 2) * (move.includes('2') ? 2 : 1) };
}
export function rotation(v: number[], axis: number, angle: number): number[] {
  const c = Math.cos(angle),
    s = Math.sin(angle),
    [x, y, z] = v;
  return axis === 0
    ? [x, y * c - z * s, y * s + z * c]
    : axis === 1
      ? [x * c + z * s, y, -x * s + z * c]
      : [x * c - y * s, x * s + y * c, z];
}
export function turn(cube: Cube, move: string, inverse = false): Cube {
  const { axis, layers, angle } = moveSpec(move, inverse);
  for (const s of cube)
    if (layers.includes(s.p[axis])) {
      s.p = rotation(s.p, axis, angle).map(Math.round);
      s.n = rotation(s.n, axis, angle).map(Math.round);
    }
  return cube;
}
export function initialState(c: { faces: FaceMap; alg: string }): Cube {
  const state = makeCube(c.faces);
  parseAlg(c.alg)
    .reverse()
    .forEach((m) => turn(state, m, true));
  return state;
}
export function solvedCube(): Cube {
  const map: Record<FaceName, number> = { Up: 0, Left: 1, Front: 2, Right: 3, Back: 4, Down: 5 };
  return makeCube(
    Object.fromEntries(
      Object.keys(FACES).map((f) => [f, Array(9).fill(map[f as FaceName])]),
    ) as FaceMap,
  );
}
export function moveDescription(move: string | null | undefined) {
  if (!move) return 'Séquence terminée';
  return `${move.replaceAll("'", '′')} : ${MOVE_NAMES[move[0]]}, ${move.includes('2') ? 'demi-tour' : move.includes("'") ? 'quart de tour antihoraire' : 'quart de tour horaire'}`;
}
export function cameraName(camera: Camera = 'front') {
  return camera === 'back' ? 'Vue fixe · U en haut · B devant' : 'Vue fixe · U en haut · F devant';
}
