import { LESSONS } from '../../data/method';
import { LessonSection } from './LessonSection';
import { MethodIndex } from './MethodIndex';
import { MethodIntro } from './MethodIntro';

export interface MethodPageProps {
  collapsed: readonly boolean[];
  onExpand: (index: number) => void;
  onToggle: (index: number) => void;
  onToggleAll: () => void;
}
export function MethodPage({ collapsed, onExpand, onToggle, onToggleAll }: MethodPageProps) {
  return (
    <main className="wrap">
      <MethodIntro />
      <MethodIndex collapsed={collapsed} onExpand={onExpand} onToggleAll={onToggleAll} />
      <div className="layout" id="guide">
        <div className="lessons">
          {LESSONS.map((lesson, index) => (
            <LessonSection
              key={lesson.number}
              lesson={lesson}
              index={index}
              collapsed={collapsed[index]}
              onToggle={() => onToggle(index)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
