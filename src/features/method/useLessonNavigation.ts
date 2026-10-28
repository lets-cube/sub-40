import { useCallback, useEffect, useState } from 'react';

import { LESSONS } from '../../data/method';
import { lessonIndexFromHash } from './navigation';

export function useLessonNavigation() {
  const [collapsed, setCollapsed] = useState<boolean[]>(() => LESSONS.map(() => false));
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
    setCollapsed((previous) => LESSONS.map(() => !previous.every(Boolean)));
  }, []);
  useEffect(() => {
    const reveal = () => {
      const index = lessonIndexFromHash(location.hash);
      if (index !== null) {
        expand(index);
      }
    };
    reveal();
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, [expand]);
  return { collapsed, expand, toggle, toggleAll };
}
