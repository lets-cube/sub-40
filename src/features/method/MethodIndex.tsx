import { LESSONS } from '../../data/method';
import { lessonHash } from './navigation';
import { ObjectiveDiagram } from './ObjectiveDiagram';

export function MethodIndex({
  collapsed,
  onExpand,
  onToggleAll,
}: {
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
        {LESSONS.map((lesson, i) => (
          <a key={lesson.number} href={lessonHash(lesson.number)} onClick={() => onExpand(i)}>
            <b>{String(lesson.number).padStart(2, '0')}</b>
            <ObjectiveDiagram index={i} />
            <strong>{lesson.title}</strong>
            <span>{lesson.goal}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
