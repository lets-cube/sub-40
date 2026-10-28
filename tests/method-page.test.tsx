import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import { AppProvider } from '../src/app/AppProvider';
import { INTERMEDIATE_METHOD } from '../src/content/methods/3x3/intermediate/method';
import type { Cube3x3Method } from '../src/content/types';
import { MethodPage } from '../src/pages/method/MethodPage';

const noop = () => {};
const render = (selected: Cube3x3Method) =>
  renderToStaticMarkup(
    <AppProvider>
      <MethodPage
        method={selected}
        collapsed={[false]}
        onExpand={noop}
        onToggle={noop}
        onToggleAll={noop}
      />
    </AppProvider>,
  );
it('renders the supplied method, diagram, case ID and pattern rather than the default content', () => {
  const method: Cube3x3Method = {
    ...INTERMEDIATE_METHOD,
    id: 'test-only',
    title: ['Autre méthode'],
    description: 'Description injectée.',
    introduction: ['Texte injecté.'],
    cases: [
      { ...INTERMEDIATE_METHOD.cases[0], id: 42, name: 'Cas injecté', alg: 'R U', variants: [] },
    ],
    lessons: [
      {
        ...INTERMEDIATE_METHOD.lessons[0],
        number: 12,
        title: 'Étape injectée',
        caseIds: [42],
        diagram: { columns: 3, tiles: Array(9).fill(3) },
      },
    ],
    patterns: [
      { ...INTERMEDIATE_METHOD.patterns[0], id: 'custom', name: 'Motif injecté', alg: 'R U' },
    ],
  };
  const html = render(method);
  expect(html).toContain('Autre méthode');
  expect(html).toContain('Texte injecté.');
  expect(html).toContain('id="etape-12"');
  expect(html).toContain('data-case="42"');
  expect(html).toContain('Cas injecté');
  expect(html).toContain('title="Motif injecté"');
  expect(html).toContain('fill="var(--cube-r)"');
  expect(html).not.toContain('La croix');
  expect(render({ ...method, patterns: [] })).not.toContain('class="pattern-chunk"');
});
