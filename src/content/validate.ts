import { validateMethod } from '../domain/learning/method';
import { COLOR_KEYS, FACES } from '../domain/puzzles/cube-3x3/constants';
import { parseSetupAlg } from '../domain/puzzles/cube-3x3/notation';
import type { Cube3x3Method } from './types';

export function readPreviewCamera(value: string | undefined) {
  if (value === undefined || value === 'front' || value === 'back') {
    return value;
  }
  throw new Error(`Vue secondaire inconnue : ${value}.`);
}

export function validateCube3x3Method(method: Cube3x3Method) {
  validateMethod(method);
  if (method.puzzleId !== 'cube-3x3') {
    throw new Error(`Puzzle non pris en charge : ${method.puzzleId}.`);
  }
  const validateFormula = (formula: string, location: string) => {
    try {
      parseSetupAlg(formula);
    } catch (error) {
      throw new Error(
        `${method.id}, ${location} : ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
    }
  };
  for (const item of method.cases) {
    validateFormula(item.alg, `cas ${item.id}`);
    for (const variant of item.variants) {
      validateFormula(variant.alg, `variante du cas ${item.id}`);
    }
    readPreviewCamera(item.previewCamera);
    for (const face of Object.keys(FACES) as (keyof typeof FACES)[]) {
      const stickers = item.faces[face];
      if (
        !stickers ||
        stickers.length !== 9 ||
        stickers.some((value) => {
          const color = Number(value);
          return (
            (typeof value === 'string' && !/^\d$/.test(value)) ||
            !Number.isInteger(color) ||
            color < 0 ||
            color >= COLOR_KEYS.length
          );
        })
      ) {
        throw new Error(`${method.id}, cas ${item.id} : masque invalide sur ${face}.`);
      }
    }
  }
  for (const pattern of method.patterns) {
    validateFormula(pattern.alg, `motif ${pattern.id}`);
  }
  for (const lesson of method.lessons) {
    const { columns, tiles } = lesson.diagram;
    if (
      columns !== 3 ||
      tiles.length !== 9 ||
      tiles.some((color) => !Number.isInteger(color) || color < 0 || color >= COLOR_KEYS.length)
    ) {
      throw new Error(`${method.id}, étape ${lesson.number} : objectif 3×3 invalide.`);
    }
  }
}

export function validateCatalog(methods: readonly Cube3x3Method[]) {
  const ids = new Set<string>();
  for (const method of methods) {
    const key = `${method.puzzleId}/${method.id}`;
    if (ids.has(key)) {
      throw new Error(`Méthode dupliquée : ${key}.`);
    }
    ids.add(key);
    validateCube3x3Method(method);
  }
}
