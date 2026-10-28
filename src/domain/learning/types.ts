export interface AlgorithmCase {
  id: number;
  name: string;
  label: string;
  alg: string;
  variants: readonly { name: string; alg: string; source: string }[];
  recognition?: string;
  training?: boolean;
}

export interface Pattern {
  id: string;
  name: string;
  alg: string;
  source: string;
}

export interface Lesson {
  number: number;
  title: string;
  explanation: string;
  goal: string;
  caseIds: readonly number[];
}

export interface LearningMethod<
  TCase extends AlgorithmCase,
  TLesson extends Lesson = Lesson,
  TPattern extends Pattern = Pattern,
> {
  id: string;
  puzzleId: string;
  title: readonly string[];
  description: string;
  sources: readonly { name: string; url: string }[];
  introduction: readonly string[];
  lessons: readonly TLesson[];
  cases: readonly TCase[];
  patterns: readonly TPattern[];
}
