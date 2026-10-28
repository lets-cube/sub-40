import cases from './cases.json';
import lessons from './lessons.json';
import patterns from './patterns.json';
import introduction from './introduction.json';
import type { Camera, FaceMap } from '../cube/engine';

export interface AlgorithmCase {
  id: number;
  name: string;
  label: string;
  alg: string;
  faces: FaceMap;
  variants: { name: string; alg: string; source: string }[];
  recognition?: string;
  previewCamera?: Camera;
  training?: boolean;
}
export interface Pattern {
  id: string;
  name: string;
  alg: string;
  source: string;
  color: string;
  background: string;
}
export const CASES = cases as AlgorithmCase[];
export const PATTERNS: Pattern[] = patterns;
export const LESSONS = lessons;
export const INTRODUCTION = introduction;
export const CUBE_COLORS = ['u', 'l', 'f', 'r', 'b', 'd', 'mask'];
export function objectiveTiles(index: number): string[] {
  if (index === 5) return ['f', 'r', 'f', 'f', 'f', 'f', 'f', 'f', 'f'];
  if (index === 6) return Array(9).fill('f');
  const lastCase = CASES[LESSONS[index].caseIds.at(-1)! - 1];
  return lastCase.faces[index < 3 ? 'Front' : 'Up'].map((c) => CUBE_COLORS[Number(c)]);
}
