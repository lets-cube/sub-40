import type { AlgorithmCase, Pattern } from './types';
export type { AlgorithmCase, Pattern, Lesson } from './types';
import cases from './cases.json';
import introduction from './introduction.json';
import lessons from './lessons.json';
import patterns from './patterns.json';

export const CASES = cases as AlgorithmCase[];
export const PATTERNS: Pattern[] = patterns;
export const LESSONS = lessons;
export const INTRODUCTION = introduction;
