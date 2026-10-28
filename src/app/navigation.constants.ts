import type { IconName } from '../shared/components/Icon';
import { MODAL_IDS } from '../shared/constants/ui';
import type { ModalName } from '../shared/state/ui-context';

export const NAVIGATION_TOOLS: readonly {
  modal: ModalName;
  name: string;
  icon: IconName;
  attribute: string;
}[] = [
  { modal: MODAL_IDS.notation, name: 'Notation', icon: 'book', attribute: 'data-notation' },
  { modal: MODAL_IDS.patterns, name: 'Motifs', icon: 'patterns', attribute: 'data-patterns' },
  { modal: MODAL_IDS.freeView, name: 'Vue libre', icon: 'cube', attribute: 'data-free-view' },
];

export const DIALOG_TITLES = {
  [MODAL_IDS.notation]: 'Comprendre la notation',
  [MODAL_IDS.patterns]: 'Motifs',
  [MODAL_IDS.freeView]: 'Vue libre',
} as const;
