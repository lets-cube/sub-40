import assert from 'node:assert/strict';

import { it, expect } from 'vitest';

import { solvedCube, moveSpec, rotation } from '../src/domain/puzzles/cube-3x3/engine';
import { svgCube, arrowCue } from '../src/rendering/svg/cube-3x3/render';
const api = { svgCube, arrowCue, solvedCube, moveSpec, rotation };
const cube = solvedCube();
it('preserves the approved printed arrows for 54 movements and 216 face projections', () => {
  let count = 0;
  for (const base of 'R L U D F B r l u d f b M E S x y z'.split(' ')) {
    for (const suffix of ['', "'", '2']) {
      const move = base + suffix;
      const spec = api.moveSpec(move);
      const referenceCue = api.arrowCue(move);
      const svg = api.svgCube(cube, { move, letters: true });
      const arrow = svg.match(/<g class="movement-arrow[\s\S]*?<\/g>/)![0];
      assert.ok(!/NaN|undefined/.test(svg));
      assert.equal((arrow.match(/<path /g) || []).length, 2);
      assert.ok(!arrow.includes('<polygon'));
      assert.ok(arrow.includes('stroke="var(--ink)" stroke-width=".24"'));
      assert.ok(arrow.includes('stroke="var(--white)" stroke-width=".105"'));
      assert.equal((arrow.match(/stroke-linecap="round"/g) || []).length, 2);
      assert.ok(svg.includes('selected-layer-outline'));
      if (base === 'U' || base === 'u') {
        assert.equal(referenceCue.surface, 'F');
        referenceCue.points.forEach((p) => assert.equal(p[1], base === 'U' ? 1 : 0.55));
      }
      assert.ok(arrow.includes('data-arrow-projection="face"'));
      assert.ok(!arrow.includes('non-scaling-stroke'));
      const mid = referenceCue.points[0].map((v, i) => (v + referenceCue.points[1][i]) / 2);
      const next = api.rotation(mid, spec.axis, spec.dir * 0.00001);
      const dir = referenceCue.points[1].map((v, i) => v - referenceCue.points[0][i]);
      assert.ok(
        dir.reduce((sum, v, i) => sum + v * (next[i] - mid[i]), 0) > 0,
        move + ' follows actual sticker travel',
      );
      for (const camera of ['front', 'back'] as const) {
        for (const inverse of [false, true]) {
          const rendered = api.svgCube(cube, {
            move,
            camera,
            animation: { move, inverse, progress: 0.5 },
          });
          const group = rendered.match(/<g class="movement-arrow[\s\S]*?<\/g>/)![0];
          const cue = api.arrowCue(move, inverse, camera);
          const side = camera === 'back' ? -1 : 1;
          const q = Math.SQRT1_2;
          const e = 0.54;
          const ce = Math.sqrt(1 - e * e);
          const z = cue.surface === 'F' ? 1.506 : -1.506;
          const expected =
            cue.surface === 'U'
              ? [
                  side * q * 62,
                  side * q * e * 62,
                  -side * q * 62,
                  side * q * e * 62,
                  180,
                  151 - ce * 1.506 * 62,
                ]
              : [
                  side * q * 62,
                  side * q * e * 62,
                  0,
                  -ce * 62,
                  180 - side * q * z * 62,
                  151 + side * q * e * z * 62,
                ];
          const matrix = group
            .match(/transform="matrix\(([^)]+)\)"/)![1]
            .split(' ')
            .map(Number);
          expected.forEach((n, i) =>
            assert.ok(
              Math.abs(matrix[i] - n) < 1e-6,
              move + ' projects the full arrow with the face',
            ),
          );
          const path = group.match(/<path d="([^"]+)"/)![1];
          const points = [...path.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((m) => [
            Number(m[1]),
            Number(m[2]),
          ]);
          assert.equal(points.length, 5);
          points.forEach((p) =>
            p.forEach((n) =>
              assert.ok(Math.abs(n) + 0.12 < 1.5, move + ' ink stays inside the face'),
            ),
          );
          const a = group
            .match(/data-arrow-start="([^"]+)"/)![1]
            .split(',')
            .map(Number);
          const b = group
            .match(/data-arrow-end="([^"]+)"/)![1]
            .split(',')
            .map(Number);
          const axes = cue.surface === 'U' ? [0, 2] : [0, 1];
          assert.ok(
            axes.reduce(
              (sum, axis, i) => sum + (b[i] - a[i]) * (cue.points[1][axis] - cue.points[0][axis]),
              0,
            ) > 0,
            move + ' keeps forward and inverse direction',
          );
          assert.ok(!group.includes('<text'), move + ' has no number below the arrow');
          for (const outline of rendered.matchAll(
            /<polygon class="selected-layer-outline"[^>]*>/g,
          )) {
            assert.ok(outline[0].includes('fill="none"'));
            assert.ok(outline[0].includes('stroke="var(--cube-selection)"'));
          }
        }
      }
      for (const options of [
        { projection: 'underside', arrows: false },
        { camera: 'back', arrows: false },
      ] as const) {
        const small = api.svgCube(cube, { move, ...options });
        assert.ok(!small.includes('movement-arrow'));
        assert.ok(!small.includes('selected-layer-outline'));
      }
      count++;
    }
  }
  for (const face of ['R', 'U', 'F']) {
    const selected = (move: string) =>
      (api.svgCube(cube, { move }).match(/class="selected-layer-outline"/g) || []).length;
    assert.equal(selected(face), 15, face + ' shows one moving layer');
    assert.equal(selected(face.toLowerCase()), 21, face + ' wide shows two moving layers');
  }
  expect(count).toBe(54);
});
it('keeps face letters visible during layer moves, and hides them during whole-cube rotations', () => {
  for (const move of ['R', "L'", 'U2', 'D', 'F', 'B', 'r', 'M', 'E', 'S']) {
    expect(
      svgCube(cube, { animation: { move, inverse: false, progress: 0.5 }, letters: true }),
    ).toContain('data-face-label=');
  }
  for (const move of ['x', 'y2', "z'"]) {
    expect(
      svgCube(cube, { animation: { move, inverse: false, progress: 0.5 }, letters: true }),
    ).not.toContain('data-face-label=');
  }
});
