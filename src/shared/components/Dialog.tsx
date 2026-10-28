import { useEffect, useRef, type ReactNode } from 'react';

import { Icon } from './Icon';

export function Dialog({
  id,
  title,
  active,
  onClose,
  children,
}: {
  id: string;
  title: string;
  active: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current!;
    if (active && !el.open) {
      el.showModal();
    } else if (!active && el.open) {
      el.close();
    }
  }, [active]);
  useEffect(() => {
    const element = dialog.current;
    if (!element) {
      return;
    }
    const closeBackdrop = (event: MouseEvent) => {
      if (event.target !== element) {
        return;
      }
      const rect = element.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        onClose();
      }
    };
    element.addEventListener('click', closeBackdrop);
    return () => element.removeEventListener('click', closeBackdrop);
  }, [onClose]);
  return (
    <dialog
      id={id}
      ref={dialog}
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header className="modal-header">
        <h2 id={`${id}-title`}>{title}</h2>
        <button
          type="button"
          data-close-dialog
          className="close"
          aria-label="Fermer"
          onClick={() => onClose()}
        >
          <Icon name="close" />
        </button>
      </header>
      {children}
    </dialog>
  );
}
