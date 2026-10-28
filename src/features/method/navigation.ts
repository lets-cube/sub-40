import { LESSONS } from '../../data/method';
import { LESSON_ANCHOR_PREFIX } from './method.constants';

export function lessonId(number: number) {
  return `${LESSON_ANCHOR_PREFIX}${number}`;
}

export function lessonHash(number: number) {
  return `#${lessonId(number)}`;
}

/** Only known lesson hashes may expand a section; unrelated anchors are ignored. */
export function lessonIndexFromHash(hash: string): number | null {
  const prefix = `#${LESSON_ANCHOR_PREFIX}`;
  if (!hash.startsWith(prefix)) {
    return null;
  }
  const number = hash.slice(prefix.length);
  if (!/^[1-9]\d*$/.test(number)) {
    return null;
  }
  const index = LESSONS.findIndex((lesson) => lesson.number === Number(number));
  return index < 0 ? null : index;
}
