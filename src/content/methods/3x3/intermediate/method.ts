import type { Cube3x3Method } from '../../../types';
import { readPreviewCamera } from '../../../validate';
import cases from './cases.json';
import introduction from './introduction.json';
import lessons from './lessons.json';
import patterns from './patterns.json';

export const INTERMEDIATE_METHOD = {
  id: 'intermediate',
  puzzleId: 'cube-3x3',
  title: ['Méthode', 'intermédiaire'],
  description:
    'ce site remet la méthode intermédiaire au goût du jour, avec le regard d’un débutant qui l’apprend.',
  sources: [
    { name: 'Francocube', url: 'https://www.francocube.com/deadalnix/moyen' },
    { name: 'J Perm', url: 'https://jperm.net/3x3/moves' },
  ],
  introduction,
  cases: cases.map((item) => ({ ...item, previewCamera: readPreviewCamera(item.previewCamera) })),
  lessons,
  patterns,
} satisfies Cube3x3Method;
