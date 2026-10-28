import { describe, expect, it } from 'vitest';

import {
  FACE_MOVE_BASES,
  MOVE_SUFFIXES,
  ROTATION_MOVE_BASES,
  SLICE_MOVE_BASES,
} from '../src/cube/constants';
import { LESSONS } from '../src/data/method';
import { FREE_VIEW_GROUPS } from '../src/features/free-view/free-view.constants';
import { lessonHash, lessonIndexFromHash } from '../src/features/method/navigation';
import { NOTATION_FAMILIES } from '../src/features/notation/notation.constants';

const commands = (bases: readonly string[]) =>
  bases.flatMap((base) => MOVE_SUFFIXES.map((suffix) => base + suffix));

describe('client control configuration', () => {
  it('exposes every free-view move exactly once, including primes and half turns', () => {
    const available = commands(FREE_VIEW_GROUPS.flatMap((group) => [...group.bases]));
    const bases = [
      ...FACE_MOVE_BASES,
      ...FACE_MOVE_BASES.toLowerCase(),
      ...SLICE_MOVE_BASES,
      ...ROTATION_MOVE_BASES,
    ];
    expect(available).toHaveLength(54);
    expect(new Set(available).size).toBe(54);
    expect(available.toSorted()).toEqual(commands(bases).toSorted());
  });
  it('keeps opposite face pairs together and slices/whole rotations in their own cards', () => {
    expect(NOTATION_FAMILIES.find((f) => f.id === 'faces')?.groups).toEqual([
      ['R', 'L'],
      ['U', 'D'],
      ['F', 'B'],
    ]);
    expect(NOTATION_FAMILIES.find((f) => f.id === 'wide')?.groups).toEqual([
      ['r', 'l'],
      ['u', 'd'],
      ['f', 'b'],
    ]);
    expect(NOTATION_FAMILIES.find((f) => f.id === 'slices')?.groups).toEqual([['M'], ['E'], ['S']]);
    expect(NOTATION_FAMILIES.find((f) => f.id === 'rotations')?.groups).toEqual([['x', 'y', 'z']]);
  });
});

describe('lesson navigation', () => {
  it('maps each public lesson link to its section index', () => {
    LESSONS.forEach((lesson, index) =>
      expect(lessonIndexFromHash(lessonHash(lesson.number))).toBe(index),
    );
  });
  it('ignores other anchors and unknown or malformed lesson numbers', () => {
    for (const hash of [
      '',
      '#top',
      '#sommaire',
      '#etape-0',
      '#etape-8',
      '#etape-01',
      '#etape-1.5',
      '#etape-1/anything',
      '#etape-1 ',
    ]) {
      expect(lessonIndexFromHash(hash)).toBeNull();
    }
  });
});
