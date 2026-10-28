import type { CSSProperties } from 'react';

import type { ColoredPattern } from '../../../content/types';
import { findPatternGroups } from '../../../domain/learning/patterns';
import { parseAlg } from '../../../domain/puzzles/cube-3x3/engine';
import { faceStyle } from './move-style';
export function Formula({
  patterns = [],
  moves,
  position,
  onSelect,
  history = false,
}: {
  patterns?: readonly ColoredPattern[];
  moves: string[];
  position?: number;
  onSelect?: (index: number) => void;
  history?: boolean;
}) {
  const groups = findPatternGroups(
    moves,
    patterns.map((pattern) => ({ ...pattern, moves: parseAlg(pattern.alg) })),
  );
  function token(i: number, pattern = false) {
    const move = moves[i];
    const current = position !== undefined && i === (history ? position - 1 : position);
    const className = [
      'move',
      pattern ? 'pattern-hit' : '',
      current ? (history ? 'history-current' : 'current') : '',
      position !== undefined && i < position ? 'played' : '',
      history && position !== undefined && i >= position ? 'history-future' : '',
    ]
      .filter(Boolean)
      .join(' ');
    const text = move.replaceAll("'", '′');
    return onSelect ? (
      <button
        key={i}
        type="button"
        className={className}
        data-token={move}
        data-history-index={history ? i : undefined}
        aria-current={current ? 'step' : undefined}
        style={faceStyle(move)}
        onClick={() => onSelect(i)}
        title={
          history
            ? `Revenir après ${text} (coup ${i + 1})`
            : `Se placer avant ${text} (coup ${i + 1})`
        }
      >
        {text}
      </button>
    ) : (
      <span key={i} className={className}>
        {text}
      </span>
    );
  }
  const children: React.ReactNode[] = [];
  for (let i = 0; i < moves.length;) {
    const group = groups.find((g) => g.start === i);
    if (group) {
      const pattern = group.patterns[0];
      children.push(
        <span
          key={`p${i}`}
          className="pattern-chunk"
          title={group.patterns.map((p) => p.name).join(' / ')}
          style={
            { '--motif-color': pattern.color, '--motif-bg': pattern.background } as CSSProperties
          }
        >
          {Array.from({ length: group.end - i }, (_, j) => token(i + j, true))}
        </span>,
      );
      i = group.end;
    } else {
      children.push(token(i));
      i++;
    }
  }
  return children;
}
