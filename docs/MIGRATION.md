# Migration React

La migration reprend la version Sites 33 du site sub 40″, issue du commit `97f4d33084ddd1cbf792c8ad19ee993f92ce9a7e` de son projet source, le 28 octobre 2026.

## Ce qui a été repris

- Les sept étapes, les textes corrigés et les 26 démonstrations Francocube.
- Les masques de stickers, les formules originales et leur écriture simplifiée.
- Le style suisse, les polices locales et le favicon 40″.
- Les motifs et leurs couleurs, dans une fenêtre avec un lecteur par motif.
- Les flèches imprimées sur les faces, les contours des couches et les deux vues du cube.
- La notation par paires R/L, U/D et F/B, les trois tranches et les rotations du cube entier.
- La vue libre, sa file de mouvements, ses raccourcis clavier, les préparations et l’historique cliquable.

Toute l’interface est rendue par des composants React. Le seul fragment de markup calculé séparément est le dessin SVG produit par le moteur du cube ; il est isolé dans `CubeView`. Les données et le moteur ne dépendent pas de React.

Les tests comparent la migration aux 310 états Francocube enregistrés avant la migration. Ils vérifient également les directions et projections des flèches, les lettres pendant les rotations, les commandes rapides, la reprise d’historique et la validation des formules.

## Archive de travail locale

Les anciens dossiers `outputs`, `site-source` et `work` de la destination ont été déplacés dans une archive extérieure au dépôt :

`/Users/horeb.parraud/Documents/Codex/2026-10-22/j/archive/sub40-before-react-20261028`

Cette archive est un filet de récupération local ; elle n’est nécessaire ni au développement, ni au build. Le dossier `.git` et son historique ont été conservés. Le projet voisin `lets-cube` n’a pas été modifié.

La configuration de déploiement GitHub Actions et Cloudflare reste à la charge du propriétaire du projet.
