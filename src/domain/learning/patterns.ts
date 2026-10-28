export interface PatternGroup<TPattern> {
  start: number;
  end: number;
  patterns: TPattern[];
}
export function findPatternGroups<TPattern extends { id: string; moves: readonly string[] }>(
  moves: string[],
  patterns: readonly TPattern[],
) {
  const hits: PatternGroup<TPattern>[] = [];
  for (const pattern of patterns) {
    const sequence = pattern.moves;
    if (!sequence.length) {
      continue;
    }
    for (let start = 0; start + sequence.length <= moves.length; start++) {
      if (sequence.every((m, i) => moves[start + i] === m)) {
        hits.push({ start, end: start + sequence.length, patterns: [pattern] });
      }
    }
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const groups: PatternGroup<TPattern>[] = [];
  for (const hit of hits) {
    const previous = groups.at(-1);
    if (previous && hit.start < previous.end) {
      previous.end = Math.max(previous.end, hit.end);
      for (const pattern of hit.patterns) {
        if (!previous.patterns.some((p) => p.id === pattern.id)) {
          previous.patterns.push(pattern);
        }
      }
    } else {
      groups.push({ ...hit, patterns: [...hit.patterns] });
    }
  }
  return groups;
}
