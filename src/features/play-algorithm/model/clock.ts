export interface Clock {
  now(): number;
  frame(callback: (time: number) => void): number;
  cancelFrame(id: number): void;
  delay(callback: () => void, milliseconds: number): number;
  cancelDelay(id: number): void;
  reducedMotion(): boolean;
}
