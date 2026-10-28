import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import type { LessonPlayback } from '../cube/playback';
import { AppUiContext, type AppUiContextValue, type ModalName } from '../shared/state/ui-context';
import { TOAST_DURATION_MS } from './app.constants';

export function AppProvider({ children }: { children: ReactNode }) {
  const [arrows, setArrows] = useState(false);
  const [modal, setModal] = useState<ModalName | null>(null);
  const [toast, setToast] = useState('');
  const players = useRef(new Set<LessonPlayback>());
  const timer = useRef<number | null>(null);

  const pauseOthers = useCallback((except?: LessonPlayback) => {
    for (const player of players.current) {
      if (player !== except) {
        player.pause();
      }
    }
  }, []);

  const register = useCallback((player: LessonPlayback) => {
    players.current.add(player);
    return () => {
      players.current.delete(player);
    };
  }, []);

  const toggleArrows = useCallback(() => setArrows((enabled) => !enabled), []);
  const open = useCallback(
    (nextModal: ModalName | null) => {
      pauseOthers();
      setModal(nextModal);
    },
    [pauseOthers],
  );

  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        pauseOthers();
      }
    };
    document.addEventListener('visibilitychange', hide);
    return () => {
      document.removeEventListener('visibilitychange', hide);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [pauseOthers]);

  const copy = useCallback(async (text: string) => {
    if (!text) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setToast('Formule copiée');
    } catch {
      setToast('Copie indisponible dans ce navigateur.');
    }
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setToast(''), TOAST_DURATION_MS);
  }, []);

  const value = useMemo<AppUiContextValue>(
    () => ({
      arrows,
      toggleArrows,
      modal,
      open,
      register,
      pauseOthers,
      copy,
    }),
    [arrows, toggleArrows, modal, open, register, pauseOthers, copy],
  );

  return (
    <AppUiContext value={value}>
      {children}
      <output className={`toast${toast ? ' visible' : ''}`}>{toast}</output>
    </AppUiContext>
  );
}
