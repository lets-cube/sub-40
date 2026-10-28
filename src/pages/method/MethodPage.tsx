import type { Cube3x3Method } from '../../content/types';
import { LessonSection } from '../../features/learn-method/LessonSection';
import { MethodIndex } from '../../features/learn-method/MethodIndex';
import { MethodIntro } from '../../features/learn-method/MethodIntro';

export interface MethodPageProps {
  method: Cube3x3Method;
  collapsed: readonly boolean[];
  onExpand: (index: number) => void;
  onToggle: (index: number) => void;
  onToggleAll: () => void;
}
export function MethodPage({
  method,
  collapsed,
  onExpand,
  onToggle,
  onToggleAll,
}: MethodPageProps) {
  return (
    <main className="wrap">
      <MethodIntro method={method} />
      <MethodIndex
        method={method}
        collapsed={collapsed}
        onExpand={onExpand}
        onToggleAll={onToggleAll}
      />
      <div className="layout" id="guide">
        <div className="lessons">
          {method.lessons.map((lesson, index) => (
            <LessonSection
              key={lesson.number}
              lesson={lesson}
              method={method}
              collapsed={collapsed[index]}
              onToggle={() => onToggle(index)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
