import type { Cube3x3Method } from '../../content/types';
import { lessonHash } from './navigation';
import { ObjectiveDiagram } from './ObjectiveDiagram';

export function MethodIndex({
  method,
  collapsed,
  onExpand,
  onToggleAll,
}: {
  method: Cube3x3Method;
  collapsed: readonly boolean[];
  onExpand: (index: number) => void;
  onToggleAll: () => void;
}) {
  return (
    <section className="method-index" id="sommaire" aria-labelledby="index-title">
      <div className="index-heading">
        <h2 id="index-title">Sommaire</h2>
        <button type="button" className="outline" onClick={onToggleAll}>
          {collapsed.every(Boolean) ? 'Tout déplier' : 'Tout replier'}
        </button>
      </div>
      <nav className="index-grid" aria-label="Sommaire">
        {method.lessons.map((lesson, i) => (
          <a key={lesson.number} href={lessonHash(lesson.number)} onClick={() => onExpand(i)}>
            <b>{String(lesson.number).padStart(2, '0')}</b>
            <ObjectiveDiagram lesson={lesson} />
            <strong>{lesson.title}</strong>
            <span>{lesson.goal}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
