import { COLOR_KEYS } from '../../../domain/puzzles/cube-3x3/constants';

export const COLORS = COLOR_KEYS.map((key) => `var(--cube-${key})`);
