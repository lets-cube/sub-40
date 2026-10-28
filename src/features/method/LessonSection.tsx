import { CASES, type Lesson } from '../../data/method';
import { AlgorithmCard } from './AlgorithmCard';
import { lessonId } from './navigation';
import { ObjectiveDiagram } from './ObjectiveDiagram';

export function LessonSection({
  lesson,
  index,
  collapsed,
  onToggle,
}: {
  lesson: Lesson;
  index: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <section id={lessonId(lesson.number)} className="lesson">
      <header className="lesson-heading">
        <span className="step-index">{String(lesson.number).padStart(2, '0')}</span>
        <div className="lesson-copy">
          <h2>{lesson.title}</h2>
          <p className="explain">{lesson.explanation}</p>
        </div>
        <button
          type="button"
          className="outline fold-lesson"
          aria-expanded={!collapsed}
          aria-controls={`cases-${lesson.number}`}
          onClick={onToggle}
        >
          {collapsed ? 'Déplier' : 'Replier'}
        </button>
        <div className="lesson-objective">
          <ObjectiveDiagram index={index} />
          <div>
            <span className="label">Objectif</span>
            <p>{lesson.goal}</p>
          </div>
        </div>
      </header>
      <div id={`cases-${lesson.number}`} className="cases-grid" hidden={collapsed}>
        {lesson.caseIds.map((id) => (
          <AlgorithmCard key={id} data={CASES[id - 1]} visible={!collapsed} />
        ))}
      </div>
    </section>
  );
}
