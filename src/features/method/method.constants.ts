export const LESSON_ANCHOR_PREFIX = 'etape-';
/** These final goals show the front face rather than the generic top view. */
export const OBJECTIVE_OVERRIDES: Readonly<Record<number, readonly string[]>> = {
  5: ['f', 'r', 'f', 'f', 'f', 'f', 'f', 'f', 'f'],
  6: ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f'],
};

export const OBJECTIVE_GRID = { columns: 3, tileSize: 12, gap: 2, size: 40 } as const;
