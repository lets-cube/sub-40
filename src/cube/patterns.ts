import { PATTERNS, type Pattern } from '../data/method';
import { parseAlg } from './engine';
export interface PatternGroup {
  start: number;
  end: number;
  patterns: Pattern[];
}
export function findPatternGroups(moves: string[], patterns: Pattern[] = PATTERNS) {
  const hits: PatternGroup[] = [];
  for (const pattern of patterns) {
    const sequence = parseAlg(pattern.alg);
    for (let start = 0; start + sequence.length <= moves.length; start++) {
      if (sequence.every((m, i) => moves[start + i] === m)) {
        hits.push({ start, end: start + sequence.length, patterns: [pattern] });
      }
    }
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const groups: PatternGroup[] = [];
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
