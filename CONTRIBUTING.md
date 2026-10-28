# Contribuer à sub 40″

Merci de prendre le temps d’améliorer le projet. Une explication plus claire ou un cas difficile à reconnaître peut être aussi utile qu’une correction de code.

## Signaler un problème

Vérifier les [issues existantes](https://github.com/lets-cube/sub-40/issues) avant d’en ouvrir une nouvelle. Pour nous aider à reproduire le problème, préciser :

- l’étape, le cas ou la fenêtre concernée ;
- la position de départ et la formule jouée, en respectant majuscules, minuscules, `′` et `2` ;
- le résultat obtenu et le résultat attendu ;
- le navigateur, l’appareil et les raccourcis utilisés ;
- une capture ou une courte vidéo si le défaut est visuel.

Pour un problème de compréhension, indiquer le passage qui pose difficulté et la façon dont vous l’avez interprété.

## Préparer une modification

1. Forker le dépôt et créer une branche pour le changement.
2. Installer Bun ≥ 1.3 et Node.js ≥ 22.12.
3. Installer les dépendances et lancer l’application :

   ```sh
   bun install --frozen-lockfile
   bun run dev
   ```

4. Faire une modification ciblée, puis lancer les contrôles :

   ```sh
   bun run fmt
   bun run check
   bun run build
   ```

`check` rassemble Oxlint, la vérification Oxfmt, la validation des contenus, TypeScript (application et noyau sans DOM) et Vitest. Les erreurs et les avertissements de lint font échouer la commande. `bun run lint:fix` applique les corrections automatiques sûres ; vérifier le diff après son exécution.

## Où intervenir

| Changement                                     | Fichiers ou dossier                                      |
| ---------------------------------------------- | -------------------------------------------------------- |
| Introduction                                   | `src/content/methods/3x3/intermediate/introduction.json` |
| Étapes et objectifs                            | `src/content/methods/3x3/intermediate/lessons.json`      |
| Algorithmes, masques et reconnaissance des cas | `src/content/methods/3x3/intermediate/cases.json`        |
| Motifs et couleurs associées                   | `src/content/methods/3x3/intermediate/patterns.json`     |
| Composition de l’application et navigation     | `src/app/`                                               |
| Méthode, notation, vue libre et motifs         | `src/features/`                                          |
| Lecture, formules et contrôles réutilisés      | `src/features/play-algorithm/`                           |
| Primitives UI sans métier                      | `src/shared/`                                            |
| Contrat de l’état partagé de l’interface       | `src/shared/state/`                                      |
| Règles et notation du puzzle                   | `src/domain/puzzles/cube-3x3/`                           |
| SVG, caméras et flèches                        | `src/rendering/`                                         |
| Assemblage de la page                          | `src/pages/`                                             |
| Typographie, couleurs et mise en page          | `src/styles/`                                            |
| Tests et positions de référence                | `tests/`                                                 |
| Captures et animation du README                | `docs/assets/`                                           |

Le [guide d’architecture](docs/ARCHITECTURE.md) décrit les responsabilités et les règles d’import. Placer les constantes dans leur fonctionnalité ou leur domaine ; réserver `shared/` aux primitives sans dépendance métier. Le guide décrit aussi comment ajouter une méthode au catalogue et les limites actuelles de la prise en charge des puzzles.

## Vérifier selon le changement

### Textes et cas pédagogiques

Conserver une terminologie cohérente entre les explications, le cube et les formules. Pour ajouter ou corriger un algorithme, fournir sa source et une position permettant de vérifier le cas. Lancer `bun run validate:content` pour vérifier les références, formules, masques et diagrammes. Les IDs n’ont pas à suivre l’ordre des tableaux.

Les formules et masques Francocube ont une référence enregistrée dans `tests/francocube-reference.json`. Une modification de cette référence doit être expliquée et vérifiée indépendamment du moteur : la régénérer à partir du résultat du code testé masquerait une régression.

### Moteur et animations

Ajouter ou adapter un test qui vérifie le comportement corrigé. Selon le changement, contrôler :

- les tours simples, inverses, doubles et de deux couches ;
- les repères fixes et les vues complémentaires ;
- la mise en file des mouvements répétés ;
- la sélection d’un coup dans l’historique et la nouvelle suite créée ensuite ;
- l’application complète d’une formule valide, et le refus d’une formule invalide sans altérer la position.

### Interface

Tester au clavier, avec les flèches activées et désactivées, puis en largeur téléphone et ordinateur. Vérifier le focus à l’ouverture et à la fermeture des fenêtres et l’option système de réduction des animations. Joindre une capture avant/après quand le changement est visuel.

Les composants et les fonctions partagées sont séparés pour préserver Fast Refresh. Les effets React déclarent leurs dépendances ; les callbacks utilisés pour l’abonnement aux lecteurs restent stables.

## Proposer la pull request

Décrire le problème, le comportement obtenu après la modification et les vérifications effectuées. Ajouter une formule de reproduction pour le cube ou une capture pour l’interface. Mettre à jour le README ou ses aperçus si l’usage de l’application change.

La configuration de déploiement est indépendante de ces contributions : aucun secret ou fichier d’environnement personnel ne doit être ajouté au dépôt.

## Licences des contributions

Les contributions au code original sont proposées sous la [licence MIT du projet](LICENSE). Les contenus pédagogiques adaptés de Francocube conservent leur licence [CC BY-SA 2.0 FR](https://creativecommons.org/licenses/by-sa/2.0/fr/). Pour des ressources externes, conserver les crédits et indiquer leur licence.
