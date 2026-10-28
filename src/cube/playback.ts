import {
  initialState,
  lessonMoves,
  solvedCube,
  turn,
  type Animation,
  type Cube,
  type FaceMap,
} from './engine';
import { parseSetupAlg } from './notation';

export const cloneCube = (cube: Cube): Cube =>
  cube.map((s) => ({ ...s, p: [...s.p], n: [...s.n] }));
export interface Clock {
  now(): number;
  frame(callback: (time: number) => void): number;
  cancelFrame(id: number): void;
  delay(callback: () => void, milliseconds: number): number;
  cancelDelay(id: number): void;
  reducedMotion(): boolean;
}
const browserClock: Clock = {
  now: () => performance.now(),
  frame: (cb) => requestAnimationFrame(cb),
  cancelFrame: (id) => cancelAnimationFrame(id),
  delay: (cb, ms) => window.setTimeout(cb, ms),
  cancelDelay: (id) => window.clearTimeout(id),
  reducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};
interface Snapshot {
  cube: Cube;
  animation: Animation | null;
  busy: boolean;
  running: boolean;
  position: number;
  history: string[];
  cursor: number;
  lastMove: string | null;
  preview: string | null;
  pending: number;
}
/** Animation owns the sticker state; React subscribes to immutable snapshots. */
abstract class Playback {
  protected cube: Cube;
  protected animation: Animation | null = null;
  protected frameId: number | null = null;
  protected delayId: number | null = null;
  protected listeners = new Set<() => void>();
  protected snapshot: Snapshot;
  protected running = false;
  protected position = 0;
  protected history: string[] = [];
  protected cursor = 0;
  protected lastMove: string | null = null;
  protected preview: string | null = null;
  protected pending = 0;
  constructor(
    cube: Cube,
    protected clock: Clock = browserClock,
  ) {
    this.cube = cube;
    this.snapshot = this.read();
  }
  private read(): Snapshot {
    return {
      cube: this.cube,
      animation: this.animation,
      busy: this.animation !== null,
      running: this.running,
      position: this.position,
      history: this.history,
      cursor: this.cursor,
      lastMove: this.lastMove,
      preview: this.preview,
      pending: this.pending,
    };
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  protected emit() {
    this.snapshot = this.read();
    for (const listener of this.listeners) {
      listener();
    }
  }
  protected cancel() {
    if (this.frameId !== null) {
      this.clock.cancelFrame(this.frameId);
    }
    if (this.delayId !== null) {
      this.clock.cancelDelay(this.delayId);
    }
    this.frameId = this.delayId = null;
    this.animation = null;
  }
  protected animate(move: string, inverse: boolean, duration: number, done: () => void) {
    const started = this.clock.now();
    const total = this.clock.reducedMotion() ? 1 : duration;
    this.animation = { move, inverse, progress: 0 };
    this.emit();
    const tick = (time: number) => {
      const progress = Math.min(1, (time - started) / total);
      this.animation = { move, inverse, progress: progress * progress * (3 - 2 * progress) };
      if (progress < 1) {
        this.emit();
        this.frameId = this.clock.frame(tick);
      } else {
        this.frameId = null;
        turn(this.cube, move, inverse);
        this.animation = null;
        done();
      }
    };
    this.frameId = this.clock.frame(tick);
  }
  dispose() {
    this.cancel();
    this.listeners.clear();
  }
}

export class LessonPlayback extends Playback {
  readonly moves: string[];
  private startCube: Cube;
  constructor(source: { alg: string; faces?: FaceMap; startSolved?: boolean }, clock?: Clock) {
    const cube = source.startSolved
      ? solvedCube()
      : initialState({ alg: source.alg, faces: source.faces! });
    super(cube, clock);
    this.startCube = cloneCube(cube);
    this.moves = lessonMoves(source.alg);
  }
  pause = () => {
    this.running = false;
    this.cancel();
    this.emit();
  };
  reset = () => {
    this.pause();
    this.position = 0;
    this.cube = cloneCube(this.startCube);
    this.emit();
  };
  /** Formula buttons place the cube immediately before the selected movement. */
  seek = (position: number) => {
    this.pause();
    this.position = Math.max(0, Math.min(position, this.moves.length));
    this.cube = cloneCube(this.startCube);
    this.moves.slice(0, this.position).forEach((move) => turn(this.cube, move));
    this.emit();
  };
  next = () => {
    this.pause();
    this.step(false);
  };
  previous = () => {
    this.pause();
    this.step(true);
  };
  private step(inverse: boolean) {
    if (inverse ? this.position === 0 : this.position === this.moves.length) {
      this.running = false;
      this.emit();
      return;
    }
    const move = this.moves[this.position - (inverse ? 1 : 0)];
    this.animate(move, inverse, move.includes('2') ? 650 : 430, () => {
      this.position += inverse ? -1 : 1;
      if (this.running && this.position < this.moves.length) {
        this.delayId = this.clock.delay(() => {
          this.delayId = null;
          this.step(false);
        }, 450);
      } else {
        this.running = false;
      }
      this.emit();
    });
  }
  toggle = () => {
    if (this.running) {
      this.pause();
      return;
    }
    if (this.position === this.moves.length) {
      this.reset();
    }
    this.cancel();
    this.running = true;
    this.emit();
    this.step(false);
  };
}

export class InteractivePlayback extends Playback {
  private base: Cube;
  private baseMove: string | null = null;
  private queue: { move: string; undo?: boolean }[] = [];
  constructor(clock?: Clock) {
    const cube = solvedCube();
    super(cube, clock);
    this.base = cloneCube(cube);
  }
  enqueue = (move: string) => {
    this.preview = null;
    this.queue.push({ move });
    this.pending = this.queue.length;
    this.drain();
  };
  private drain() {
    if (this.animation) {
      this.emit();
      return;
    }
    const command = this.queue.shift();
    this.pending = this.queue.length;
    if (!command) {
      this.emit();
      return;
    }
    if (!command.undo && this.cursor < this.history.length) {
      this.history = this.history.slice(0, this.cursor);
    }
    this.animate(
      command.move,
      Boolean(command.undo),
      command.move.includes('2') ? 440 : 260,
      () => {
        if (command.undo) {
          this.history = this.history.slice(0, this.cursor - 1);
          this.cursor--;
        } else {
          this.history = [...this.history.slice(0, this.cursor), command.move];
          this.cursor++;
        }
        this.lastMove = this.history[this.cursor - 1] || this.baseMove;
        this.emit();
        this.drain();
      },
    );
  }
  hover = (move: string | null) => {
    if (!this.animation) {
      this.preview = move;
      this.emit();
    }
  };
  seek = (cursor: number) => {
    this.cancel();
    this.queue = [];
    this.pending = 0;
    this.preview = null;
    this.cursor = Math.max(0, Math.min(cursor, this.history.length));
    this.cube = cloneCube(this.base);
    this.history.slice(0, this.cursor).forEach((move) => turn(this.cube, move));
    this.lastMove = this.history[this.cursor - 1] || this.baseMove;
    this.emit();
  };
  undo = () => {
    if (this.animation || !this.cursor) {
      return;
    }
    this.queue.push({ move: this.history[this.cursor - 1], undo: true });
    this.drain();
  };
  clearHistory = () => {
    if (this.animation) {
      return;
    }
    this.base = cloneCube(this.cube);
    this.baseMove = this.lastMove;
    this.history = [];
    this.cursor = 0;
    this.emit();
  };
  reset = () => {
    this.cancel();
    this.queue = [];
    this.pending = 0;
    this.history = [];
    this.cursor = 0;
    this.lastMove = this.baseMove = this.preview = null;
    this.cube = solvedCube();
    this.base = cloneCube(this.cube);
    this.emit();
  };
  applySetup = (text: string) => {
    const moves = parseSetupAlg(text); // Validate everything before altering the current state.
    this.reset();
    moves.forEach((move) => turn(this.cube, move));
    this.base = cloneCube(this.cube);
    this.lastMove = this.baseMove = moves.at(-1) || null;
    this.emit();
  };
  appliedMoves = () => this.history.slice(0, this.cursor);
}
