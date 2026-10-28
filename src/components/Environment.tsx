import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { LessonPlayback } from '../cube/playback';
export type ModalName = 'notations' | 'patterns' | 'free-view';
interface Environment {
  arrows: boolean;
  toggleArrows: () => void;
  modal: ModalName | null;
  open: (modal: ModalName | null) => void;
  register: (player: LessonPlayback) => () => void;
  pauseOthers: (except?: LessonPlayback) => void;
  copy: (text: string) => Promise<void>;
}
const Context = createContext<Environment | null>(null);
export function useEnvironment() {
  return useContext(Context)!;
}
export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [arrows, setArrows] = useState(false),
    [modal, setModal] = useState<ModalName | null>(null),
    [toast, setToast] = useState('');
  const players = useRef(new Set<LessonPlayback>()),
    timer = useRef<number | null>(null);
  function pauseOthers(except?: LessonPlayback) {
    for (const player of players.current) if (player !== except) player.pause();
  }
  useEffect(() => {
    const hide = () => {
      if (document.hidden) pauseOthers();
    };
    document.addEventListener('visibilitychange', hide);
    return () => {
      document.removeEventListener('visibilitychange', hide);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  async function copy(text: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setToast('Formule copiée');
    } catch {
      setToast('Copie indisponible dans ce navigateur.');
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(''), 2400);
  }
  const value: Environment = {
    arrows,
    toggleArrows: () => setArrows((a) => !a),
    modal,
    open: (m) => {
      pauseOthers();
      setModal(m);
    },
    register: (p) => {
      players.current.add(p);
      return () => {
        players.current.delete(p);
      };
    },
    pauseOthers,
    copy,
  };
  return (
    <Context value={value}>
      {children}
      <div className={`toast${toast ? ' visible' : ''}`} role="status">
        {toast}
      </div>
    </Context>
  );
}
