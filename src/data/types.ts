import type { Camera, FaceMap } from '../cube/engine';

export interface AlgorithmCase {
  id: number;
  name: string;
  label: string;
  alg: string;
  faces: FaceMap;
  variants: { name: string; alg: string; source: string }[];
  recognition?: string;
  previewCamera?: Camera;
  training?: boolean;
}
export interface Pattern {
  id: string;
  name: string;
  alg: string;
  source: string;
  color: string;
  background: string;
}
export interface Lesson {
  number: number;
  title: string;
  explanation: string;
  goal: string;
  caseIds: number[];
}
