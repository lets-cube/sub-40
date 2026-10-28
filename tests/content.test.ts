import { describe, expect, it } from 'vitest';

import { METHODS, findMethod } from '../src/content/catalog';
import { INTERMEDIATE_METHOD } from '../src/content/methods/3x3/intermediate/method';
import type { Cube3x3Method } from '../src/content/types';
import { readPreviewCamera, validateCatalog, validateCube3x3Method } from '../src/content/validate';
import { getMethodCase, validateMethod } from '../src/domain/learning/method';
import { findPatternGroups } from '../src/domain/learning/patterns';
import { lessonHash, lessonIndexFromHash } from '../src/features/learn-method/navigation';

const fixture = (): Cube3x3Method => structuredClone(INTERMEDIATE_METHOD);

describe('method content boundaries', () => {
  it('validates the published catalogue and identifies methods by puzzle and method', () => {
    expect(() => validateCatalog(METHODS)).not.toThrow();
    expect(findMethod('cube-3x3', 'intermediate')).toBe(INTERMEDIATE_METHOD);
    expect(findMethod('cube-2x2', 'intermediate')).toBeUndefined();
    expect(findMethod('cube-3x3', 'missing')).toBeUndefined();
  });

  it('resolves case IDs and lesson anchors without relying on array indexes', () => {
    const method = fixture();
    method.cases = method.cases.toReversed();
    method.lessons = [{ ...method.lessons[0], number: 42 }];
    expect(() => validateCube3x3Method(method)).not.toThrow();
    expect(getMethodCase(method, 1).name).toBe('La croix');
    expect(lessonIndexFromHash(lessonHash(42), method.lessons)).toBe(0);
    expect(lessonIndexFromHash('#etape-1', method.lessons)).toBeNull();
    expect(() => getMethodCase(method, 999)).toThrow('Cas introuvable');
  });

  it('rejects duplicate catalogue entries, case IDs and lesson numbers', () => {
    expect(() => validateCatalog([INTERMEDIATE_METHOD, INTERMEDIATE_METHOD])).toThrow(
      'Méthode dupliquée',
    );
    const method = fixture();
    method.cases = [...method.cases, method.cases[0]];
    expect(() => validateMethod(method)).toThrow('identifiant de cas');
    method.cases = INTERMEDIATE_METHOD.cases;
    method.lessons = [...method.lessons, method.lessons[0]];
    expect(() => validateMethod(method)).toThrow('numéro d’étape');
  });

  it('rejects missing or repeated case references in a lesson', () => {
    const method = fixture();
    method.lessons = [{ ...method.lessons[0], caseIds: [999] }];
    expect(() => validateMethod(method)).toThrow('cas inconnu 999');
    method.lessons = [{ ...method.lessons[0], caseIds: [1, 1] }];
    expect(() => validateMethod(method)).toThrow('cas répété');
  });

  it('rejects unsupported moves in cases, variants and patterns with their location', () => {
    const method = fixture();
    method.cases = [{ ...method.cases[0], alg: 'R Q' }];
    method.lessons = [{ ...method.lessons[0], caseIds: [1] }];
    expect(() => validateCube3x3Method(method)).toThrow('intermediate, cas 1');
    method.cases = [
      { ...method.cases[0], alg: 'R', variants: [{ name: 'invalid', alg: 'R Q', source: 'test' }] },
    ];
    expect(() => validateCube3x3Method(method)).toThrow('variante du cas 1');
    method.cases = [{ ...method.cases[0], variants: [] }];
    method.patterns = [{ ...method.patterns[0], alg: '(R' }];
    expect(() => validateCube3x3Method(method)).toThrow('motif sexy');
  });

  it('rejects invalid sticker counts, color values, objective diagrams and cameras', () => {
    const method = fixture();
    method.cases = [
      { ...method.cases[0], faces: { ...method.cases[0].faces, Front: [0] } },
      ...method.cases.slice(1),
    ];
    expect(() => validateCube3x3Method(method)).toThrow('masque invalide sur Front');
    method.cases = INTERMEDIATE_METHOD.cases;
    method.lessons = [{ ...method.lessons[0], diagram: { columns: 3, tiles: Array(9).fill(8) } }];
    expect(() => validateCube3x3Method(method)).toThrow('objectif 3×3 invalide');
    method.lessons = [{ ...method.lessons[0], diagram: { columns: 3, tiles: Array(9).fill(0) } }];
    method.cases = [
      { ...method.cases[0], faces: { ...method.cases[0].faces, Front: Array(9).fill('8') } },
      ...method.cases.slice(1),
    ];
    expect(() => validateCube3x3Method(method)).toThrow('masque invalide sur Front');
    expect(() => readPreviewCamera('sideways')).toThrow('Vue secondaire inconnue');
  });

  it('validates teaching structure independently of cube-specific state', () => {
    expect(() =>
      validateMethod({
        id: 'test-method',
        puzzleId: 'test-puzzle',
        title: ['Test'],
        description: '',
        sources: [],
        introduction: [],
        cases: [{ id: 17, name: 'Test', alg: 'A', label: '', variants: [] }],
        lessons: [{ number: 4, title: 'Step', explanation: '', goal: 'Goal', caseIds: [17] }],
        patterns: [],
      }),
    ).not.toThrow();
  });
});

it('matches supplied pattern tokens without assuming a cube notation or catalogue', () => {
  const patterns = [
    { id: 'other-puzzle', moves: ['A', 'B'] },
    { id: 'empty', moves: [] },
  ];
  expect(findPatternGroups(['X', 'A', 'B', 'Y'], patterns)).toEqual([
    { start: 1, end: 3, patterns: [patterns[0]] },
  ]);
});
