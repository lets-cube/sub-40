import type { Clock } from '../model/clock';

export const browserClock: Clock = {
  now: () => performance.now(),
  frame: (cb) => requestAnimationFrame(cb),
  cancelFrame: (id) => cancelAnimationFrame(id),
  delay: (cb, ms) => window.setTimeout(cb, ms),
  cancelDelay: (id) => window.clearTimeout(id),
  reducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};
