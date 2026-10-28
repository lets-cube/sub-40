export type Camera = 'front' | 'back';
export function cameraName(camera: Camera = 'front') {
  return camera === 'back' ? 'Vue fixe · U en haut · B devant' : 'Vue fixe · U en haut · F devant';
}
