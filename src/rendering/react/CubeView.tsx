import { type Animation, type Cube } from '../../domain/puzzles/cube-3x3/engine';
import type { Camera } from '../svg/cube-3x3/camera';
import { svgCube } from '../svg/cube-3x3/render';

/** A drawing-only SVG island: UI, controls and state are all managed by React. */
export function CubeView({
  cube,
  animation,
  move,
  arrows,
  previewCamera = 'front',
}: {
  cube: Cube;
  animation?: Animation | null;
  move?: string | null;
  arrows: boolean;
  previewCamera?: Camera;
}) {
  const primary = svgCube(cube, { animation, move, arrows, letters: true });
  const preview = svgCube(cube, {
    animation,
    arrows: false,
    letters: true,
    camera: previewCamera,
    projection: previewCamera === 'back' ? 'perspective' : 'underside',
  });
  return (
    <div
      className="cube-mount"
      dangerouslySetInnerHTML={{
        __html: `${primary}<div class="reverse-preview">${preview}</div>`,
      }}
    />
  );
}
