const FULL_MOVE_NAMES: Record<string, string> = {
  R: 'Right (droite)',
  L: 'Left (gauche)',
  U: 'Up (haut)',
  D: 'Down (bas)',
  F: 'Front (avant)',
  B: 'Back (arrière)',
  r: 'Right wide (deux couches de droite)',
  l: 'Left wide (deux couches de gauche)',
  u: 'Up wide (deux couches du haut)',
  d: 'Down wide (deux couches du bas)',
  f: 'Front wide (deux couches avant)',
  b: 'Back wide (deux couches arrière)',
  M: 'Middle (tranche centrale verticale)',
  E: 'Equator (tranche centrale horizontale)',
  S: 'Standing (tranche parallèle à la face avant)',
  x: 'Rotation x (axe droite–gauche)',
  y: 'Rotation y (axe haut–bas)',
  z: 'Rotation z (axe avant–arrière)',
};
export function fullMoveName(move?: string | null) {
  if (!move) return 'Cube résolu';
  return `${move.replaceAll("'", '′')} — ${FULL_MOVE_NAMES[move[0]]}${move.includes('2') ? ' · demi-tour' : move.includes("'") ? ' · sens inverse' : ''}`;
}
// Strict, bounded parsing for user-entered setups; never apply a partial formula.
export function parseSetupAlg(text: string) {
  const source = text.replace(/[′’]/g, "'");
  let index = 0;
  function skip() {
    while (/\s/.test(source[index] || '') && index < source.length) index++;
  }
  function sequence(depth = 0): string[] {
    if (depth > 8) throw new Error('Trop de parenthèses imbriquées.');
    const moves: string[] = [];
    while (index < source.length) {
      skip();
      if (index >= source.length || source[index] === ')') break;
      if (source[index] === '(') {
        index++;
        const group = sequence(depth + 1);
        skip();
        if (source[index] !== ')') throw new Error('Il manque une parenthèse fermante.');
        index++;
        const repeat = source.slice(index).match(/^\d+/);
        const count = repeat ? Number(repeat[0]) : 1;
        if (repeat) index += repeat[0].length;
        if (!group.length || count < 1 || count > 99 || moves.length + group.length * count > 500)
          throw new Error('La formule doit contenir de 1 à 500 mouvements.');
        for (let i = 0; i < count; i++) moves.push(...group);
      } else {
        const token = source
          .slice(index)
          .match(/^(?:[RLUDFB]w|[RLUDFBMESxyzXYZrludfb])(?:2'?|'2?)?/);
        if (!token)
          throw new Error(`Notation inconnue près de « ${source.slice(index, index + 10)} ».`);
        index += token[0].length;
        let move = token[0]
          .replace(/([RLUDFB])w/, (_, f) => f.toLowerCase())
          .replace(/^[XYZ]/, (f) => f.toLowerCase());
        if (move.includes('2')) move = move[0] + '2';
        moves.push(move);
        if (moves.length > 500) throw new Error('La formule est limitée à 500 mouvements.');
      }
    }
    return moves;
  }
  const moves = sequence();
  skip();
  if (index !== source.length) throw new Error('Parenthèse fermante en trop.');
  if (!moves.length) throw new Error('Saisissez une formule, par exemple R U R′ U′.');
  return moves;
}
export function keyboardCommand(
  e: Pick<KeyboardEvent, 'key' | 'code' | 'altKey' | 'shiftKey'>,
  wide = false,
) {
  const plain = e.key.toUpperCase(),
    physical = /^Key([A-Z])$/.exec(e.code || '')?.[1];
  const letter = e.altKey && physical ? physical : plain;
  if (letter.length !== 1 || !'RLUDFBMESXYZ'.includes(letter)) return null;
  const base = 'XYZ'.includes(letter)
    ? letter.toLowerCase()
    : (e.altKey || wide) && 'RLUDFB'.includes(letter)
      ? letter.toLowerCase()
      : letter;
  return base + (e.shiftKey ? "'" : '');
}
