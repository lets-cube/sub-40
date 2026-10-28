export type Camera = 'front' | 'back';
export type FaceName = 'Up' | 'Down' | 'Front' | 'Back' | 'Right' | 'Left';
export type FaceMap = Record<FaceName, (number | string)[]>;
export interface Sticker {
  p: number[];
  n: number[];
  c: number;
}
export type Cube = Sticker[];
export interface Animation {
  move: string;
  inverse: boolean;
  progress: number;
}
