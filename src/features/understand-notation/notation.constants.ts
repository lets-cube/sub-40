export type NotationFamilyId = 'faces' | 'wide' | 'slices' | 'rotations';
export interface NotationFamily {
  id: NotationFamilyId;
  name: string;
  groups: readonly (readonly string[])[];
}
export const NOTATION_FAMILIES: readonly NotationFamily[] = [
  {
    id: 'faces',
    name: 'Faces',
    groups: [
      ['R', 'L'],
      ['U', 'D'],
      ['F', 'B'],
    ],
  },
  {
    id: 'wide',
    name: 'Doubles couches',
    groups: [
      ['r', 'l'],
      ['u', 'd'],
      ['f', 'b'],
    ],
  },
  { id: 'slices', name: 'M · E · S', groups: [['M'], ['E'], ['S']] },
  { id: 'rotations', name: 'x · y · z', groups: [['x', 'y', 'z']] },
];
