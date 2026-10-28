# sub 40″

Apprendre la méthode intermédiaire du Rubik’s Cube, avec des algorithmes animés, une aide fléchée et un cube libre pour essayer des combinaisons.

Cette version reprend le site existant dans une application **React + TypeScript + Vite**, avec **Bun** pour les dépendances et les commandes. Le style suisse, les 26 démonstrations Francocube et les interactions du cube sont conservés.

## Démarrer

Prérequis : [Bun](https://bun.sh/) 1.3 ou plus récent et Node.js 22.12 ou plus récent (utilisé par Vite). Le dépôt utilise Bun 1.3.14 et contient son fichier de verrouillage `bun.lock`.

```sh
bun install --frozen-lockfile
bun run dev
```

Ouvrir l’adresse affichée par Vite, habituellement `http://localhost:5173`.

## Vérifier et construire

```sh
bun run typecheck
bun run test
bun run build
bun run preview
```

`bun run build` vérifie TypeScript puis produit le site dans **`dist/`**. `bun run preview` sert ce résultat localement. Pour formater les sources : `bun run format` ; pour contrôler le format : `bun run format:check`.

Les tests couvrent les 26 algorithmes et leurs masques, 310 états de référence Francocube, les flèches projetées sur les faces, les animations, la saisie répétée, les positions de départ et la reprise depuis l’historique.

## Organisation

```text
src/
  App.tsx               Page, navigation et fenêtres
  components/           Algorithmes, motifs, notation et vue libre
  cube/
    engine.ts           Coordonnées des stickers et rotations
    render.ts           Dessin SVG du cube et des flèches
    playback.ts         Lecture, file de mouvements et historique
    notation.ts         Analyse des formules et raccourcis clavier
    patterns.ts         Repérage des motifs dans les algorithmes
  data/                 Étapes, textes, 26 cas et motifs en JSON
  styles/               Styles et typographies locales
public/
  favicon.svg           40″, avec le symbole des secondes en rouge
  fonts/                Archivo et Source Serif 4
tests/                 Références et tests Vitest
```

Pour modifier les explications : `src/data/introduction.json` et `src/data/lessons.json`. Les formules et les masques sont dans `src/data/cases.json`. Les couleurs des motifs sont dans `src/data/patterns.json` ; les couleurs du cube et les variables du design dans `src/styles/theme.css`.

React gère toute l’interface. Le calcul des rotations reste indépendant du navigateur et de React ; le rendu SVG est isolé dans `CubeView`. Aucune dépendance au site hébergé sur ChatGPT n’est nécessaire à l’exécution. Les polices et le favicon sont servis localement.

## Utilisation

- Un clic sur un mouvement d’un algorithme place le cube juste avant ce mouvement. Les commandes permettent de lire, avancer, reculer et recommencer.
- Le grand cube garde les repères U–F–R. Le petit montre F–R–D au début de la méthode, puis U–B–L à partir de l’étape 04.
- L’aide fléchée est désactivée au chargement et s’active depuis le menu.
- Les cubes de notation et de la vue libre gardent leur position entre les mouvements. Les saisies rapides sont mises en file.
- Dans la vue libre, cliquer sur un coup de l’historique retrouve la position après ce coup. Jouer un nouveau mouvement crée une suite à partir de cette position.
- « Position de départ » applique une formule depuis un cube résolu. Les parenthèses et répétitions sont acceptées ; une formule invalide n’altère pas le cube.
- Au clavier : R, L, U, D, F, B, M, E, S, X, Y, Z ; Maj pour l’inverse ; Option sur Mac ou Alt sur Windows/Linux pour les deux couches.

## Hébergement

L’application est entièrement statique : **commande de build `bun run build`, dossier à publier `dist/`**. Elle ne demande ni serveur applicatif, ni base de données, ni authentification.

La configuration GitHub Actions et Cloudflare sera ajoutée séparément. Aucun workflow de déploiement, fichier Wrangler ou secret Cloudflare n’est fourni ici. Pour Cloudflare Pages, sélectionner la racine de ce dépôt, utiliser la commande de build ci-dessus et le répertoire de sortie `dist`. Pour Cloudflare Workers avec Static Assets, servir ce même répertoire.

Le routage utilise les ancres de la page (`#etape-4`, par exemple) ; il ne nécessite pas de réécriture de routes. L’hébergement est prévu à la racine d’un domaine. Pour un sous-répertoire, adapter `base` dans `vite.config.ts` et les chemins des ressources publiques.

## Sources et crédits

Les 26 démonstrations et masques proviennent de la [méthode intermédiaire de Deadalnix / Francocube](https://www.francocube.com/deadalnix/moyen), adaptés sous [CC BY-SA 2.0 FR](https://creativecommons.org/licenses/by-sa/2.0/fr/). Leurs références sont conservées dans `tests/francocube-reference.json`.

Notations : [J Perm](https://jperm.net/3x3/moves). Motifs : [SpeedCubeReview](https://www.speedcubereview.com/oll-groups.html) et [melody.games](https://cube.melody.games/). Polices : Archivo et Source Serif 4, distribuées sous SIL Open Font License ; notices dans `public/fonts/`.

Le dessin du cube, les flèches et l’interface ont été recréés pour sub 40″. Les détails de la reprise de l’ancien projet sont dans `docs/MIGRATION.md`.
