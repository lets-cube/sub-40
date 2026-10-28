import type { CSSProperties } from 'react';
import { findPatternGroups } from '../cube/patterns';
const FACE_COLORS: Record<string, string> = { U: 'u', D: 'd', F: 'f', B: 'b', R: 'r', L: 'l' };
export function faceStyle(move: string): CSSProperties {
  const color = FACE_COLORS[move[0].toUpperCase()];
  return {
    '--face-color': color ? `var(--cube-${color})` : 'var(--ink)',
    '--active-ink': color ? 'var(--ink)' : 'var(--paper)',
  } as CSSProperties;
}
export function Formula({
  moves,
  position,
  onSelect,
  history = false,
}: {
  moves: string[];
  position?: number;
  onSelect?: (index: number) => void;
  history?: boolean;
}) {
  const groups = findPatternGroups(moves);
  function token(i: number, pattern = false) {
    const move = moves[i],
      current = position !== undefined && i === (history ? position - 1 : position);
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
  for (let i = 0; i < moves.length; ) {
    const group = groups.find((g) => g.start === i);
    if (group) {
      const p = group.patterns[0];
      children.push(
        <span
          key={`p${i}`}
          className="pattern-chunk"
          title={group.patterns.map((p) => p.name).join(' / ')}
          style={{ '--motif-color': p.color, '--motif-bg': p.background } as CSSProperties}
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
