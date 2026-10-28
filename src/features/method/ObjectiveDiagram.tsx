import { LESSONS } from '../../data/method';
import { OBJECTIVE_GRID } from './method.constants';
import { objectiveTiles } from './objectives';

export function ObjectiveDiagram({ index }: { index: number }) {
  return (
    <svg
      className="objective-diagram"
      width={OBJECTIVE_GRID.size}
      height={OBJECTIVE_GRID.size}
      viewBox={`0 0 ${OBJECTIVE_GRID.size} ${OBJECTIVE_GRID.size}`}
      aria-label={LESSONS[index].goal}
    >
      <title>{LESSONS[index].goal}</title>
      {objectiveTiles(index).map((color, tile) => (
        <rect
          key={tile}
          x={(tile % OBJECTIVE_GRID.columns) * (OBJECTIVE_GRID.tileSize + OBJECTIVE_GRID.gap)}
          y={
            Math.floor(tile / OBJECTIVE_GRID.columns) *
            (OBJECTIVE_GRID.tileSize + OBJECTIVE_GRID.gap)
          }
          width={OBJECTIVE_GRID.tileSize}
          height={OBJECTIVE_GRID.tileSize}
          fill={`var(--cube-${color})`}
        />
      ))}
    </svg>
  );
}
