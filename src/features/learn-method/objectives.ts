import type { IllustratedLesson } from '../../content/types';
import { COLOR_KEYS } from '../../domain/puzzles/cube-3x3/constants';

export function objectiveTiles(lesson: IllustratedLesson): string[] {
  return lesson.diagram.tiles.map((color) => COLOR_KEYS[color]);
}
