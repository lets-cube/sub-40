import { FACES } from '../../../domain/puzzles/cube-3x3/constants';
import {
  moveSpec,
  rotation,
  moveDescription,
  type Cube,
  type Animation,
} from '../../../domain/puzzles/cube-3x3/engine';
import { cameraName, type Camera } from './camera';
import { COLORS } from './render.constants';
const dot = (a: number[], b: number[]) =>
  a.reduce((value, coordinate, index) => value + coordinate * b[index], 0);
const faceName = (normal: number[]) =>
  normal[0]
    ? normal[0] > 0
      ? 'R'
      : 'L'
    : normal[1]
      ? normal[1] > 0
        ? 'U'
        : 'D'
      : normal[2] > 0
        ? 'F'
        : 'B';
const point = (coordinates: number[]) => coordinates.map((value) => value.toFixed(5)).join(',');

export interface RenderOptions {
  move?: string | null;
  animation?: Animation | null;
  label?: string | null;
  arrows?: boolean;
  letters?: boolean;
  projection?: 'perspective' | 'underside';
  camera?: Camera;
}
export function arrowCue(move: string, inverse = false, camera: Camera = 'front') {
  const side = camera === 'back' ? -1 : 1;
  const left = side === 1 ? 'F' : 'B';
  const spec = moveSpec(move, inverse);
  const layer =
    spec.layers.length === 3
      ? 0
      : spec.layers.length === 2
        ? spec.layers[0] * 0.55
        : spec.layers[0];
  let surface: 'U' | 'F' | 'B';
  let points: number[][];
  let direction: number;
  if (spec.axis === 0) {
    surface = left;
    direction = -spec.dir * side;
    points = [
      [layer, -direction * 0.94, 1.59 * side],
      [layer, direction * 0.94, 1.59 * side],
    ];
  } else if (spec.axis === 1) {
    direction = spec.dir * side;
    if (spec.layers.length === 3) {
      surface = 'U';
      points = [
        [-direction * 0.94, 1.59, 0.9 * side],
        [direction * 0.94, 1.59, 0.9 * side],
      ];
    } else {
      surface = left;
      points = [
        [-direction * 0.94, layer, 1.59 * side],
        [direction * 0.94, layer, 1.59 * side],
      ];
    }
  } else {
    surface = 'U';
    direction = -spec.dir;
    points = [
      [-direction * 0.94, 1.59, layer],
      [direction * 0.94, 1.59, layer],
    ];
  }
  return { surface, points, halfTurn: move.includes('2') };
}
export function svgCube(
  cube: Cube,
  {
    move = null,
    animation = null,
    label = null,
    arrows = true,
    letters = false,
    projection = 'perspective',
    camera = 'front',
  }: RenderOptions = {},
) {
  const side = camera === 'back' ? -1 : 1;
  const reverse = projection === 'underside';
  const diagonal = Math.SQRT1_2;
  const e = 0.54;
  const ce = Math.sqrt(1 - e * e);
  const vertical = reverse ? -1 : 1;
  const view = [side * diagonal * ce, vertical * e, side * diagonal * ce];
  const right = [side * diagonal, 0, -side * diagonal];
  const down = [side * vertical * diagonal * e, -ce, side * vertical * diagonal * e];

  const project = (p: number[]) => [180 + dot(p, right) * 62, 151 + dot(p, down) * 62];
  const spec = move ? moveSpec(move, Boolean(animation?.inverse)) : null;
  const anim = animation ? moveSpec(animation.move, animation.inverse) : null;
  const transform = (p: number[], n: number[], base: number[]) =>
    anim && anim.layers.includes(base[anim.axis])
      ? [
          rotation(p, anim.axis, anim.angle * animation!.progress),
          rotation(n, anim.axis, anim.angle * animation!.progress),
        ]
      : [p, n];

  const shapes: { depth: number; html: string }[] = [];
  function tile(base: number[], normal: number[], color: string, sticker: boolean) {
    const center = base.map((v, i) => v + normal[i] * (sticker ? 0.506 : 0.5));
    const axis = normal.findIndex((v) => v !== 0);
    const axes = [0, 1, 2].filter((a) => a !== axis);
    const corners = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ].map((q) => {
      const p = [...center];
      p[axes[0]] += q[0] * (sticker ? 0.445 : 0.495);
      p[axes[1]] += q[1] * (sticker ? 0.445 : 0.495);
      return p;
    });
    const [p, n] = transform(center, normal, base);
    if (dot(n, view) < 0.001) {
      return;
    }
    const selected = sticker && spec && spec.layers.includes(base[spec.axis]);
    const points = corners
      .map((c) =>
        project(transform(c, normal, base)[0])
          .map((v) => v.toFixed(2))
          .join(','),
      )
      .join(' ');
    const tag = sticker && !animation ? ` data-sticker-face="${faceName(normal)}"` : '';
    shapes.push({
      depth: dot(p, view) + (sticker ? 0.002 : 0),
      html: `<polygon${tag} points="${points}" fill="${color}" stroke="${sticker ? (selected && arrows ? 'var(--ink)' : 'var(--cube-plastic)') : color}" stroke-width="${sticker ? 1 : 0.5}" stroke-linejoin="round"/>${selected && arrows && !reverse ? `<polygon class="selected-layer-outline" points="${points}" fill="none" stroke="var(--cube-selection)" stroke-width="1.7" stroke-linejoin="round"/>` : ''}`,
    });
  }
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        for (const f of Object.values(FACES)) {
          tile([x, y, z], f.n, 'var(--cube-plastic)', false);
        }
      }
    }
  }
  cube.forEach((s) => tile(s.p, s.n, COLORS[s.c], true));
  shapes.sort((a, b) => a.depth - b.depth);
  let overlays = '';
  let faceLabels = '';
  if (letters && (!animation || !'xyz'.includes(animation.move[0]))) {
    for (const [f, n] of [
      ['R', [1, 0, 0]],
      ['L', [-1, 0, 0]],
      ['U', [0, 1, 0]],
      ['D', [0, -1, 0]],
      ['F', [0, 0, 1]],
      ['B', [0, 0, -1]],
    ] as [string, number[]][]) {
      if (dot(n, view) > 0.01) {
        const p = project(n.map((v) => v * 1.53));
        faceLabels += `<text data-face-label="${f}" x="${p[0]}" y="${p[1] + (reverse ? 8 : 4)}" text-anchor="middle" font-size="${reverse ? 27 : 17}" font-family="Arial" font-weight="700" fill="#172a22" stroke="#ffffffbb" stroke-width="3" paint-order="stroke">${f}</text>`;
      }
    }
  }
  // Keep every arrow on the principal cube; the complementary view is a reference only.
  // Draw the complete ink shape in face coordinates, then project it with the face.
  if (spec && arrows && !reverse) {
    const cue = arrowCue(move!, Boolean(animation?.inverse), camera);
    const axes = cue.surface === 'U' ? [0, 2] : [0, 1];
    const start = axes.map((axis) => cue.points[0][axis]);
    const end = axes.map((axis) => cue.points[1][axis]);
    const delta = end.map((v, i) => v - start[i]);
    const distance = Math.hypot(...delta);
    const along = delta.map((v) => v / distance);
    const across = [-along[1], along[0]];
    const center = start.map((v, i) => (v + end[i]) / 2);
    const tail = center.map((v, i) => v - along[i] * 1.14);
    const tip = center.map((v, i) => v + along[i] * 1.14);
    const left = tip.map((v, i) => v - along[i] * 0.34 + across[i] * 0.24);
    const arrowRight = tip.map((v, i) => v - along[i] * 0.34 - across[i] * 0.24);

    const path = `M${point(tail)} L${point(tip)} M${point(left)} L${point(tip)} L${point(arrowRight)}`;
    const origin =
      cue.surface === 'U' ? [0, 1.506, 0] : [0, 0, cue.surface === 'F' ? 1.506 : -1.506];
    const projectedOrigin = project(origin);
    const basis = axes.map((axis) => {
      const p = [...origin];
      p[axis] += 1;
      const screen = project(p);
      return screen.map((v, i) => v - projectedOrigin[i]);
    });
    const matrix = [basis[0][0], basis[0][1], basis[1][0], basis[1][1], ...projectedOrigin]
      .map((v) => v.toFixed(7))
      .join(' ');
    overlays += `<g class="movement-arrow straight-arrow printed-arrow" data-arrow-move="${move}" data-arrow-surface="${cue.surface}" data-arrow-segments="1" data-arrow-projection="face" data-arrow-start="${point(tail)}" data-arrow-end="${point(tip)}" transform="matrix(${matrix})"><path d="${path}" fill="none" stroke="var(--ink)" stroke-width=".24" stroke-linecap="round" stroke-linejoin="round"/><path d="${path}" fill="none" stroke="var(--white)" stroke-width=".105" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  const accessible =
    label ||
    `${reverse ? (camera === 'back' ? 'Vue du dessous · B devant · L à droite · D dessous' : 'Vue du dessous · F devant · R droite · D dessous') : cameraName(camera)}. ${move ? moveDescription(move) : 'Position du cube'}`;
  return `<svg viewBox="0 0 360 300" class="${reverse ? 'reverse-view' : 'cube-view'}" data-camera="${camera === 'back' ? (reverse ? 'back-underside' : 'back') : reverse ? 'underside' : 'fixed'}" role="img" aria-label="${accessible}"><title>${accessible}</title>${shapes.map((s) => s.html).join('')}${overlays}${faceLabels}</svg>`;
}
