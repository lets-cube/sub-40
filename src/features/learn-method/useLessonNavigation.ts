import { useCallback, useEffect, useState } from 'react';

import type { Lesson } from '../../domain/learning/types';
import { lessonIndexFromHash } from './navigation';

export function useLessonNavigation(lessons: readonly Lesson[]) {
  const [collapsed, setCollapsed] = useState<boolean[]>(() => lessons.map(() => false));
  const expand = useCallback((index: number) => {
    setCollapsed((previous) =>
      previous.map((value, current) => (current === index ? false : value)),
    );
  }, []);
  const toggle = useCallback((index: number) => {
    setCollapsed((previous) =>
      previous.map((value, current) => (current === index ? !value : value)),
    );
  }, []);
  const toggleAll = useCallback(() => {
    setCollapsed((previous) => lessons.map(() => !previous.every(Boolean)));
  }, [lessons]);
  useEffect(() => {
    const reveal = () => {
      const index = lessonIndexFromHash(location.hash, lessons);
      if (index !== null) {
        expand(index);
      }
    };
    reveal();
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, [expand, lessons]);
  return { collapsed, expand, toggle, toggleAll };
}
