import { type Animation, type Camera, type Cube } from '../../cube/engine';
import { svgCube } from '../../cube/render';

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
