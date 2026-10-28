import { INTERMEDIATE_METHOD } from './methods/3x3/intermediate/method';
import type { Cube3x3Method } from './types';

export const METHODS: readonly Cube3x3Method[] = [INTERMEDIATE_METHOD];

export function findMethod(puzzleId: string, methodId: string) {
  return METHODS.find((method) => method.puzzleId === puzzleId && method.id === methodId);
}
