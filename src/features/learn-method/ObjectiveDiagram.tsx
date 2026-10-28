import type { IllustratedLesson } from '../../content/types';
import { OBJECTIVE_GRID } from './method.constants';
import { objectiveTiles } from './objectives';

export function ObjectiveDiagram({ lesson }: { lesson: IllustratedLesson }) {
  return (
    <svg
      className="objective-diagram"
      width={OBJECTIVE_GRID.size}
      height={OBJECTIVE_GRID.size}
      viewBox={`0 0 ${OBJECTIVE_GRID.size} ${OBJECTIVE_GRID.size}`}
      aria-label={lesson.goal}
    >
      <title>{lesson.goal}</title>
      {objectiveTiles(lesson).map((color, tile) => (
        <rect
          key={tile}
          x={(tile % lesson.diagram.columns) * (OBJECTIVE_GRID.tileSize + OBJECTIVE_GRID.gap)}
          y={
            Math.floor(tile / lesson.diagram.columns) *
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
