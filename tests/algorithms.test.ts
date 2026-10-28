import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { INTERMEDIATE_METHOD } from '../src/content/methods/3x3/intermediate/method';
import {
  initialState,
  invertAlg,
  lessonMoves,
  parseAlg,
  solvedCube,
  sourceNotation,
  turn,
  type Cube,
} from '../src/domain/puzzles/cube-3x3/engine';
const { cases: CASES, lessons: LESSONS } = INTERMEDIATE_METHOD;
import { objectiveTiles } from '../src/features/learn-method/objectives';
import reference from './francocube-reference.json';
export const digest = (cube: Cube) =>
  createHash('sha256')
    .update(
      cube
        .map((s) => [...s.p, ...s.n, s.c].map((n) => n || 0).join(','))
        .toSorted()
        .join(';'),
    )
    .digest('hex');

describe('Francocube migration reference', () => {
  it('preserves all 26 source formulas, masks and 310 independently recorded cube states', () => {
    expect(CASES).toHaveLength(26);
    let frames = 0;
    CASES.forEach((data, index) => {
      const expected = reference.cases[index];
      expect(data.alg).toBe(expected.alg);
      expect(data.faces).toEqual(expected.faces);
      const cube = initialState(data);
      const tokens = parseAlg(data.alg);
      expected.frames.forEach((hash, step) => {
        expect(digest(cube), `case ${index + 1}, movement ${step}`).toBe(hash);
        if (step < tokens.length) {
          turn(cube, tokens[step]);
        }
        frames++;
      });
      const compact = initialState(data);
      let boundary = 0;
      lessonMoves(data.alg).forEach((move) => {
        turn(compact, move);
        const next = expected.frames.indexOf(digest(compact), boundary + 1);
        expect(next).toBeGreaterThan(boundary);
        boundary = next;
      });
      expect(digest(compact)).toBe(expected.frames.at(-1));
    });
    expect(frames).toBe(310);
  });
  it('keeps the simplified H OLL 21 formula and original source notation', () => {
    expect(lessonMoves(CASES[15].alg)).toEqual([
      'R',
      'U',
      "R'",
      'U',
      'R',
      "U'",
      "R'",
      'U',
      'R',
      'U2',
      "R'",
    ]);
    expect(sourceNotation(CASES[15].alg)).toBe('R U (R′ U R U′)2 U′ R′');
    expect(lessonMoves("R R' U U U U r r")).toEqual(['r2']);
  });
  it('keeps every lesson, the U–B–L small previews from step 4, and final objective diagrams', () => {
    expect(LESSONS.flatMap((l) => l.caseIds)).toEqual(CASES.map((c) => c.id));
    expect(CASES.slice(0, 10).every((c) => c.previewCamera !== 'back')).toBe(true);
    expect(CASES.slice(10).every((c) => c.previewCamera === 'back')).toBe(true);
    expect(objectiveTiles(LESSONS[5])).toEqual(['f', 'r', 'f', 'f', 'f', 'f', 'f', 'f', 'f']);
    expect(objectiveTiles(LESSONS[6])).toEqual(Array(9).fill('f'));
  });
  it('training setups cancel the solving formula for the last two steps', () => {
    CASES.filter((c) => c.training).forEach((c) => {
      const cube = solvedCube();
      parseAlg(invertAlg(c.alg)).forEach((m) => turn(cube, m));
      lessonMoves(c.alg).forEach((m) => turn(cube, m));
      expect(digest(cube)).toBe(digest(solvedCube()));
    });
  });
});
