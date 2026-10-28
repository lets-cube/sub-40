import type { AlgorithmCase, LearningMethod, Lesson, Pattern } from './types';

export function getMethodCase<TCase extends AlgorithmCase>(
  method: { cases: readonly TCase[] },
  id: number,
): TCase {
  const found = method.cases.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Cas introuvable : ${id}.`);
  }
  return found;
}

/** Teaching structure is validated without knowing any puzzle or rendering engine. */
export function validateMethod<
  TCase extends AlgorithmCase,
  TLesson extends Lesson,
  TPattern extends Pattern,
>(method: LearningMethod<TCase, TLesson, TPattern>) {
  const prefix = `${method.puzzleId}/${method.id}`;
  const fail = (message: string): never => {
    throw new Error(`${prefix} : ${message}`);
  };
  if (
    !method.id.trim() ||
    !method.puzzleId.trim() ||
    !method.title.length ||
    method.title.some((line) => !line.trim())
  ) {
    fail('identité ou titre manquant.');
  }
  if (!method.lessons.length || !method.cases.length) {
    fail('la méthode doit contenir des étapes et des cas.');
  }
  const caseIds = new Set<number>();
  for (const item of method.cases) {
    if (!Number.isSafeInteger(item.id) || item.id < 1 || caseIds.has(item.id)) {
      fail(`identifiant de cas invalide ou dupliqué : ${item.id}.`);
    }
    if (!item.name.trim() || !item.alg.trim()) {
      fail(`cas ${item.id} sans nom ou formule.`);
    }
    caseIds.add(item.id);
  }
  const numbers = new Set<number>();
  for (const lesson of method.lessons) {
    if (!Number.isSafeInteger(lesson.number) || lesson.number < 1 || numbers.has(lesson.number)) {
      fail(`numéro d’étape invalide ou dupliqué : ${lesson.number}.`);
    }
    numbers.add(lesson.number);
    if (!lesson.title.trim() || !lesson.goal.trim() || !lesson.caseIds.length) {
      fail(`étape ${lesson.number} incomplète.`);
    }
    if (new Set(lesson.caseIds).size !== lesson.caseIds.length) {
      fail(`cas répété dans l’étape ${lesson.number}.`);
    }
    for (const id of lesson.caseIds) {
      if (!caseIds.has(id)) {
        fail(`l’étape ${lesson.number} référence le cas inconnu ${id}.`);
      }
    }
  }
  const patterns = new Set<string>();
  for (const pattern of method.patterns) {
    if (
      !pattern.id.trim() ||
      patterns.has(pattern.id) ||
      !pattern.name.trim() ||
      !pattern.alg.trim()
    ) {
      fail(`motif invalide ou dupliqué : ${pattern.id}.`);
    }
    patterns.add(pattern.id);
  }
}
