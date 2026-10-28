import { createContext, useContext } from 'react';

import type { MODAL_IDS } from '../constants/ui';

export type ModalName = (typeof MODAL_IDS)[keyof typeof MODAL_IDS];
export interface Pausable {
  pause: () => void;
}

export interface AppUiContextValue {
  arrows: boolean;
  toggleArrows: () => void;
  modal: ModalName | null;
  open: (modal: ModalName | null) => void;
  register: (player: Pausable) => () => void;
  pauseOthers: (except?: Pausable) => void;
  copy: (text: string) => Promise<void>;
}

export const AppUiContext = createContext<AppUiContextValue | null>(null);

export function useAppUi() {
  const environment = useContext(AppUiContext);
  if (!environment) {
    throw new Error('useAppUi requires an AppProvider.');
  }
  return environment;
}
