import { useEffect, useRef } from 'react';

import { LESSONS } from '../../data/method';
import { lessonHash } from '../../features/method/navigation';
import { ArrowToggle } from '../../shared/components/ArrowToggle';
import { Icon } from '../../shared/components/Icon';
import { useAppUi, type ModalName } from '../../shared/state/ui-context';
import { APP_NAME } from '../app.constants';
import { NAVIGATION_TOOLS } from '../navigation.constants';

export function SiteHeader({ expand }: { expand: (index: number) => void }) {
  const env = useAppUi();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node) && menu.current) {
        menu.current.open = false;
      }
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  function open(modal: ModalName) {
    if (menu.current) {
      menu.current.open = false;
    }
    env.open(modal);
  }
  const tools = (className: string) =>
    NAVIGATION_TOOLS.map((tool) => (
      <button
        key={tool.modal}
        type="button"
        className={className}
        {...{ [tool.attribute]: true }}
        onClick={() => open(tool.modal)}
      >
        <Icon name={tool.icon} />
        <span>{tool.name}</span>
      </button>
    ));
  return (
    <header className="topbar" id="top">
      <div className="wrap">
        <a href="#top" className="brand" aria-label="sub 40 secondes, accueil">
          {APP_NAME}
        </a>
        <div className="top-actions">
          <nav className="desktop-tools" aria-label="Outils">
            {tools('outline top-shortcut')}
          </nav>
          <details className="site-menu" ref={menu}>
            <summary>
              <Icon name="menu" />
              <span>Menu</span>
            </summary>
            <div className="site-menu-panel">
              <div className="menu-tools">
                {tools('outline')}
                <ArrowToggle />
              </div>
              <p className="label">Étapes</p>
              <nav aria-label="Étapes de la méthode">
                {LESSONS.map((lesson, i) => (
                  <a
                    className="step-link"
                    key={lesson.number}
                    href={lessonHash(lesson.number)}
                    onClick={() => {
                      expand(i);
                      if (menu.current) {
                        menu.current.open = false;
                      }
                    }}
                  >
                    <span className="num">{String(lesson.number).padStart(2, '0')}</span>
                    <span>{lesson.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
