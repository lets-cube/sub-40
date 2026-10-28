import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { CASES, INTRODUCTION, LESSONS, PATTERNS, objectiveTiles } from './data/method';
import { EnvironmentProvider, useEnvironment, type ModalName } from './components/Environment';
import { AlgorithmCard, PatternCard } from './components/Players';
import { ArrowToggle, FreeExplorer, NotationExplorer } from './components/Interactive';
import { Icon, type IconName } from './components/Icons';

function Objective({ index }: { index: number }) {
  return (
    <span className="objective-diagram" role="img" aria-label={LESSONS[index].goal}>
      {objectiveTiles(index).map((color, i) => (
        <i key={i} style={{ '--tile': `var(--cube-${color})` } as CSSProperties} />
      ))}
    </span>
  );
}
const TOOLS: { modal: ModalName; name: string; icon: IconName; attribute: string }[] = [
  { modal: 'notations', name: 'Notation', icon: 'book', attribute: 'data-notation' },
  { modal: 'patterns', name: 'Motifs', icon: 'patterns', attribute: 'data-patterns' },
  { modal: 'free-view', name: 'Vue libre', icon: 'cube', attribute: 'data-free-view' },
];
function Header({ expand }: { expand: (index: number) => void }) {
  const env = useEnvironment(),
    menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node) && menu.current) menu.current.open = false;
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
    if (menu.current) menu.current.open = false;
    env.open(modal);
  }
  const tools = (className: string) =>
    TOOLS.map((tool) => (
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
    <header className="topbar">
      <div className="wrap">
        <a href="#" className="brand" aria-label="sub 40 secondes, accueil">
          sub 40″
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
                    href={`#etape-${lesson.number}`}
                    onClick={() => {
                      expand(i);
                      if (menu.current) menu.current.open = false;
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
function Modal({ id, title, children }: { id: ModalName; title: string; children: ReactNode }) {
  const env = useEnvironment(),
    dialog = useRef<HTMLDialogElement>(null),
    active = env.modal === id;
  useEffect(() => {
    const el = dialog.current!;
    if (active && !el.open) el.showModal();
    else if (!active && el.open) el.close();
  }, [active]);
  return (
    <dialog
      id={id}
      ref={dialog}
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault();
        env.open(null);
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const rect = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        )
          env.open(null);
      }}
    >
      <header className="modal-header">
        <h2 id={`${id}-title`}>{title}</h2>
        <button
          type="button"
          data-close-dialog
          className="close"
          aria-label="Fermer"
          onClick={() => env.open(null)}
        >
          <Icon name="close" />
        </button>
      </header>
      {children}
    </dialog>
  );
}
function Modals() {
  const env = useEnvironment();
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (env.modal) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [env.modal]);
  return (
    <>
      <Modal id="notations" title="Comprendre la notation">
        <NotationExplorer active={env.modal === 'notations'} />
        <div className="notation-bottom">
          <button type="button" className="outline" onClick={() => env.open('free-view')}>
            Vue libre
          </button>
        </div>
      </Modal>
      <Modal id="patterns" title="Motifs">
        <p className="notation-intro">Des motifs communs à beaucoup d’algorithmes.</p>
        <div className="patterns-grid">
          {PATTERNS.map((p) => (
            <PatternCard key={p.id} pattern={p} />
          ))}
        </div>
      </Modal>
      <Modal id="free-view" title="Vue libre">
        <FreeExplorer active={env.modal === 'free-view'} />
      </Modal>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <a href="#" className="footer-brand">
          sub 40″
        </a>
        <p>
          Les 26 démonstrations originales de{' '}
          <a href="https://www.francocube.com/deadalnix/moyen">Deadalnix / Francocube</a>, adaptées
          sous{' '}
          <a href="https://creativecommons.org/licenses/by-sa/2.0/fr/" rel="license">
            CC BY-SA 2.0 FR
          </a>
          .<br />
          Interface, flèches et schémas recréés. Notations :{' '}
          <a href="https://jperm.net/3x3/moves">référence J Perm</a>. Motifs :{' '}
          <a href="https://www.speedcubereview.com/oll-groups.html">SpeedCubeReview</a> et{' '}
          <a href="https://cube.melody.games/">melody.games</a>.
        </p>
        <a href="#">Retour en haut ↑</a>
      </div>
    </footer>
  );
}
function Method() {
  const [collapsed, setCollapsed] = useState<boolean[]>(() => LESSONS.map(() => false)),
    env = useEnvironment();
  const expand = (i: number) =>
    setCollapsed((previous) => previous.map((value, index) => (index === i ? false : value)));
  useEffect(() => {
    const reveal = () => {
      const match = location.hash.match(/^#etape-([1-7])$/);
      if (match) expand(Number(match[1]) - 1);
    };
    reveal();
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, []);
  return (
    <>
      <Header expand={expand} />
      <main className="wrap">
        <section className="hero" aria-labelledby="page-title">
          <h1 id="page-title">
            Méthode
            <br />
            intermédiaire
          </h1>
          <div className="hero-copy">
            <p>
              Inspiré de <a href="https://www.francocube.com/deadalnix/moyen">Francocube</a> et de{' '}
              <a href="https://jperm.net/3x3/moves">J Perm</a>, ce site remet la méthode
              intermédiaire au goût du jour, avec le regard d’un débutant qui l’apprend.
            </p>
            {INTRODUCTION.map((p, i) => (
              <p className="method-explanation" key={i}>
                {p}
              </p>
            ))}
          </div>
        </section>
        <section className="method-index" id="sommaire" aria-labelledby="index-title">
          <div className="index-heading">
            <h2 id="index-title">Sommaire</h2>
            <button
              type="button"
              className="outline"
              onClick={() => {
                env.pauseOthers();
                setCollapsed(LESSONS.map(() => !collapsed.every(Boolean)));
              }}
            >
              {collapsed.every(Boolean) ? 'Tout déplier' : 'Tout replier'}
            </button>
          </div>
          <nav className="index-grid" aria-label="Sommaire">
            {LESSONS.map((lesson, i) => (
              <a key={lesson.number} href={`#etape-${lesson.number}`} onClick={() => expand(i)}>
                <b>{String(lesson.number).padStart(2, '0')}</b>
                <Objective index={i} />
                <strong>{lesson.title}</strong>
                <span>{lesson.goal}</span>
              </a>
            ))}
          </nav>
        </section>
        <div className="layout" id="guide">
          <div className="lessons">
            {LESSONS.map((lesson, i) => (
              <section key={lesson.number} id={`etape-${lesson.number}`} className="lesson">
                <header className="lesson-heading">
                  <span className="step-index">{String(lesson.number).padStart(2, '0')}</span>
                  <div className="lesson-copy">
                    <h2>{lesson.title}</h2>
                    <p className="explain">{lesson.explanation}</p>
                  </div>
                  <button
                    type="button"
                    className="outline fold-lesson"
                    aria-expanded={!collapsed[i]}
                    aria-controls={`cases-${lesson.number}`}
                    onClick={() =>
                      setCollapsed((previous) =>
                        previous.map((value, index) => (index === i ? !value : value)),
                      )
                    }
                  >
                    {collapsed[i] ? 'Déplier' : 'Replier'}
                  </button>
                  <div className="lesson-objective">
                    <Objective index={i} />
                    <div>
                      <span className="label">Objectif</span>
                      <p>{lesson.goal}</p>
                    </div>
                  </div>
                </header>
                <div id={`cases-${lesson.number}`} className="cases-grid" hidden={collapsed[i]}>
                  {lesson.caseIds.map((id) => (
                    <AlgorithmCard key={id} data={CASES[id - 1]} visible={!collapsed[i]} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <Modals />
    </>
  );
}
export default function App() {
  return (
    <EnvironmentProvider>
      <Method />
    </EnvironmentProvider>
  );
}
