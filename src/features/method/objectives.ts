import { COLOR_KEYS } from '../../cube/constants';
import { CASES, LESSONS } from '../../data/method';
import { OBJECTIVE_OVERRIDES } from './method.constants';

export function objectiveTiles(index: number): string[] {
  const override = OBJECTIVE_OVERRIDES[index];
  if (override) {
    return [...override];
  }
  const lastCase = CASES[LESSONS[index].caseIds.at(-1)! - 1];
  return lastCase.faces[index < 3 ? 'Front' : 'Up'].map((c) => COLOR_KEYS[Number(c)]);
}
