import type { Cube3x3Method, IllustratedLesson } from '../../content/types';
import { getMethodCase } from '../../domain/learning/method';
import { AlgorithmCard } from './AlgorithmCard';
import { lessonId } from './navigation';
import { ObjectiveDiagram } from './ObjectiveDiagram';

export function LessonSection({
  lesson,
  method,
  collapsed,
  onToggle,
}: {
  lesson: IllustratedLesson;
  method: Cube3x3Method;
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
          <ObjectiveDiagram lesson={lesson} />
          <div>
            <span className="label">Objectif</span>
            <p>{lesson.goal}</p>
          </div>
        </div>
      </header>
      <div id={`cases-${lesson.number}`} className="cases-grid" hidden={collapsed}>
        {lesson.caseIds.map((id) => (
          <AlgorithmCard
            key={id}
            data={getMethodCase(method, id)}
            patterns={method.patterns}
            visible={!collapsed}
          />
        ))}
      </div>
    </section>
  );
}
