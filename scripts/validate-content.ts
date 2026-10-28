import { METHODS } from '../src/content/catalog';
import { validateCatalog } from '../src/content/validate';

validateCatalog(METHODS);
console.log(
  `Contenus valides : ${METHODS.length} méthode(s), ${METHODS.reduce((count, method) => count + method.cases.length, 0)} cas.`,
);
