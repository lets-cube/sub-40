import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { InteractivePlayback, LessonPlayback, type Clock } from '../src/cube/playback';
import { initialState, lessonMoves, solvedCube, turn, type Cube } from '../src/cube/engine';
import { keyboardCommand, parseSetupAlg } from '../src/cube/notation';
import { CASES } from '../src/data/method';
const digest = (cube: Cube) =>
  createHash('sha256')
    .update(
      cube
        .map((s) => [...s.p, ...s.n, s.c].map((n) => n || 0).join(','))
        .sort()
        .join(';'),
    )
    .digest('hex');
/** Deterministic animation clock: exercise intermediate frames and queued turns. */
class TestClock implements Clock {
  time = 0;
  id = 0;
  frames = new Map<number, (time: number) => void>();
  timers = new Map<number, { at: number; cb: () => void }>();
  now = () => this.time;
  reducedMotion = () => false;
  frame = (cb: (time: number) => void) => {
    const id = ++this.id;
    this.frames.set(id, cb);
    return id;
  };
  cancelFrame = (id: number) => {
    this.frames.delete(id);
  };
  delay = (cb: () => void, ms: number) => {
    const id = ++this.id;
    this.timers.set(id, { at: this.time + ms, cb });
    return id;
  };
  cancelDelay = (id: number) => {
    this.timers.delete(id);
  };
  advance(ms: number) {
    for (let i = 0; i < Math.ceil(ms / 10); i++) {
      this.time += 10;
      const callbacks = [...this.frames.values()];
      this.frames.clear();
      callbacks.forEach((cb) => cb(this.time));
      for (const [id, timer] of this.timers)
        if (timer.at <= this.time) {
          this.timers.delete(id);
          timer.cb();
        }
    }
  }
}
const expected = (moves: string[]) => {
  const cube = solvedCube();
  moves.forEach((move) => turn(cube, move));
  return digest(cube);
};
describe('persistent interactive cube', () => {
  it('queues rapid inputs without resetting or losing a turn, including four equal turns', () => {
    const clock = new TestClock(),
      p = new InteractivePlayback(clock);
    ['R', 'R', 'R', 'R'].forEach(p.enqueue);
    clock.advance(100);
    expect(p.getSnapshot().animation?.progress).toBeGreaterThan(0);
    clock.advance(1100);
    expect(p.getSnapshot().history).toEqual(['R', 'R', 'R', 'R']);
    expect(digest(p.getSnapshot().cube)).toBe(expected([]));
    ['R', 'U', "R'", 'u2', 'M', "z'"].forEach(p.enqueue);
    clock.advance(2500);
    expect(digest(p.getSnapshot().cube)).toBe(expected(['R', 'U', "R'", 'u2', 'M', "z'"]));
  });
  it('restores a clicked history position and branches there, discarding only the future', () => {
    const clock = new TestClock(),
      p = new InteractivePlayback(clock);
    ['R', 'U', "R'", 'F2'].forEach(p.enqueue);
    clock.advance(1600);
    p.seek(2);
    expect(digest(p.getSnapshot().cube)).toBe(expected(['R', 'U']));
    expect(p.getSnapshot().history).toHaveLength(4);
    expect(p.appliedMoves()).toEqual(['R', 'U']);
    p.enqueue('D');
    clock.advance(400);
    expect(p.getSnapshot().history).toEqual(['R', 'U', 'D']);
    expect(digest(p.getSnapshot().cube)).toBe(expected(['R', 'U', 'D']));
  });
  it('cancels in-flight moves on history seek and reset', () => {
    const clock = new TestClock(),
      p = new InteractivePlayback(clock);
    p.enqueue('R');
    clock.advance(300);
    p.enqueue('U');
    p.enqueue('B2');
    clock.advance(100);
    p.seek(0);
    clock.advance(1000);
    expect(digest(p.getSnapshot().cube)).toBe(expected([]));
    expect(p.getSnapshot().history).toEqual(['R']);
    p.enqueue('F');
    clock.advance(80);
    p.reset();
    clock.advance(500);
    expect(p.getSnapshot().history).toEqual([]);
    expect(digest(p.getSnapshot().cube)).toBe(expected([]));
  });
  it('applies a setup atomically, undoes turns, and clears history without changing position', () => {
    const clock = new TestClock(),
      p = new InteractivePlayback(clock);
    p.applySetup('(R U R′ U′)2');
    const setup = parseSetupAlg('(R U R′ U′)2');
    expect(digest(p.getSnapshot().cube)).toBe(expected(setup));
    expect(() => p.applySetup('R U unknown')).toThrow();
    expect(digest(p.getSnapshot().cube)).toBe(expected(setup));
    p.enqueue('D2');
    clock.advance(500);
    p.undo();
    clock.advance(500);
    expect(digest(p.getSnapshot().cube)).toBe(expected(setup));
    expect(p.getSnapshot().history).toEqual([]);
    p.enqueue('L');
    clock.advance(300);
    p.clearHistory();
    expect(p.getSnapshot().history).toEqual([]);
    p.enqueue('U');
    clock.advance(300);
    p.seek(0);
    expect(digest(p.getSnapshot().cube)).toBe(expected([...setup, 'L']));
  });
});
describe('lesson playback', () => {
  it('seeks to the correct original state and supports forward/back/reset', () => {
    const clock = new TestClock(),
      p = new LessonPlayback(CASES[15], clock);
    p.seek(10);
    const expectedCube = initialState(CASES[15]);
    lessonMoves(CASES[15].alg)
      .slice(0, 10)
      .forEach((m) => turn(expectedCube, m));
    expect(digest(p.getSnapshot().cube)).toBe(digest(expectedCube));
    p.next();
    clock.advance(800);
    expect(p.getSnapshot().position).toBe(11);
    p.previous();
    clock.advance(800);
    expect(digest(p.getSnapshot().cube)).toBe(digest(expectedCube));
    p.reset();
    expect(digest(p.getSnapshot().cube)).toBe(digest(initialState(CASES[15])));
  });
  it('pause cancels a partial turn, and automatic playback reaches the target', () => {
    const clock = new TestClock(),
      p = new LessonPlayback(CASES[0], clock);
    p.toggle();
    clock.advance(100);
    p.pause();
    clock.advance(600);
    expect(p.getSnapshot().position).toBe(0);
    expect(digest(p.getSnapshot().cube)).toBe(digest(initialState(CASES[0])));
    p.toggle();
    clock.advance(7000);
    expect(p.getSnapshot().position).toBe(p.moves.length);
    expect(p.getSnapshot().running).toBe(false);
  });
});
describe('setup notation and keyboard', () => {
  it('accepts prime, wide, nested repetitions and uppercase whole-cube rotations', () => {
    expect(parseSetupAlg('(Rw U’ (M2 X)2)2')).toEqual([
      'r',
      "U'",
      'M2',
      'x',
      'M2',
      'x',
      'r',
      "U'",
      'M2',
      'x',
      'M2',
      'x',
    ]);
  });
  it('rejects malformed and oversized formulas rather than applying a valid prefix', () => {
    for (const text of [
      'R Q',
      'R )',
      '(R U',
      '(R)100',
      '(R U)0',
      '(R U F B L D)99',
      '((((((((((R))))))))))',
      '',
    ])
      expect(() => parseSetupAlg(text)).toThrow();
  });
  it('reads Option + physical key on Mac, even when its key value is accented', () => {
    expect(keyboardCommand({ key: '®', code: 'KeyR', altKey: true, shiftKey: false })).toBe('r');
    expect(keyboardCommand({ key: 'R', code: 'KeyR', altKey: false, shiftKey: true })).toBe("R'");
    expect(keyboardCommand({ key: 'X', code: 'KeyX', altKey: false, shiftKey: true })).toBe("x'");
    expect(keyboardCommand({ key: 'u', code: 'KeyU', altKey: false, shiftKey: false }, true)).toBe(
      'u',
    );
  });
});
