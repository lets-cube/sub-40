import { createContext, useContext } from 'react';

import type { LessonPlayback } from '../cube/playback';

export type ModalName = 'notations' | 'patterns' | 'free-view';
export interface Environment {
  arrows: boolean;
  toggleArrows: () => void;
  modal: ModalName | null;
  open: (modal: ModalName | null) => void;
  register: (player: LessonPlayback) => () => void;
  pauseOthers: (except?: LessonPlayback) => void;
  copy: (text: string) => Promise<void>;
}

export const EnvironmentContext = createContext<Environment | null>(null);

export function useEnvironment() {
  const environment = useContext(EnvironmentContext);
  if (!environment) {
    throw new Error('useEnvironment requires an EnvironmentProvider.');
  }
  return environment;
}
