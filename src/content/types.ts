import type { AlgorithmCase, LearningMethod, Lesson, Pattern } from '../domain/learning/types';
import type { FaceMap } from '../domain/puzzles/cube-3x3/types';

export interface Cube3x3Case extends AlgorithmCase {
  faces: FaceMap;
  previewCamera?: 'front' | 'back';
}

export interface IllustratedLesson extends Lesson {
  diagram: { columns: number; tiles: readonly number[] };
}

export interface ColoredPattern extends Pattern {
  color: string;
  background: string;
}

export interface Cube3x3Method extends LearningMethod<
  Cube3x3Case,
  IllustratedLesson,
  ColoredPattern
> {
  puzzleId: 'cube-3x3';
}
