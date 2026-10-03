# Walter Puzzle

<p align="right"><a href="README.md">🇬🇧</a> · 🇫🇷</p>

<p align="center">
  <a href="https://walter.tw/puzzle/"><img src="Images/play-online-fr.svg" alt="Jouer en ligne" height="60"></a>
</p>

Le Walter Puzzle est un puzzle de pavage composé de **16 pièces en forme de pièces de puzzle**, à assembler dans une **grille de 4 × 4**.
Il paraît simple, car chaque pièce s'emboîte avec presque toutes les autres, mais remplir toute la grille sans la moindre erreur est un vrai défi de logique.

Le puzzle existe sous deux formes :

- une **version physique**, imprimable en 3D (un plateau et 16 pièces, voir `3D Models/`) ;
- une **version web** (voir `Web/`), jouable sur ordinateur et sur téléphone, qui peut aussi générer des défis, ajouter des contraintes optionnelles, résoudre une grille et compter ses solutions.

## Les pièces

Chaque pièce est un carré à quatre côtés : haut, droite, bas et gauche.
Chaque côté est soit un **tenon** (il dépasse), soit une **encoche** (il est creusé).

Avec deux formes possibles sur quatre côtés, il existe 2<sup>4</sup> = **16 pièces possibles**, et le puzzle contient **chacune d'elles exactement une fois** : de la pièce qui n'a que des encoches à celle qui n'a que des tenons.

<table>
  <tr><td align="center"><img src="Web/pieces/0.svg" width="60"><br>0</td><td align="center"><img src="Web/pieces/1.svg" width="60"><br>1</td><td align="center"><img src="Web/pieces/2.svg" width="60"><br>2</td><td align="center"><img src="Web/pieces/3.svg" width="60"><br>3</td><td align="center"><img src="Web/pieces/4.svg" width="60"><br>4</td><td align="center"><img src="Web/pieces/5.svg" width="60"><br>5</td><td align="center"><img src="Web/pieces/6.svg" width="60"><br>6</td><td align="center"><img src="Web/pieces/7.svg" width="60"><br>7</td></tr>
  <tr><td align="center"><img src="Web/pieces/8.svg" width="60"><br>8</td><td align="center"><img src="Web/pieces/9.svg" width="60"><br>9</td><td align="center"><img src="Web/pieces/10.svg" width="60"><br>10</td><td align="center"><img src="Web/pieces/11.svg" width="60"><br>11</td><td align="center"><img src="Web/pieces/12.svg" width="60"><br>12</td><td align="center"><img src="Web/pieces/13.svg" width="60"><br>13</td><td align="center"><img src="Web/pieces/14.svg" width="60"><br>14</td><td align="center"><img src="Web/pieces/15.svg" width="60"><br>15</td></tr>
</table>

Le numéro d'une pièce indique quels côtés ont un tenon : on ajoute **1** pour un tenon en haut, **2** à droite, **4** en bas et **8** à gauche.
Par exemple, la pièce 5 = 1 + 4 a des tenons en haut et en bas, et des encoches à gauche et à droite.

Sur l'ensemble du jeu, chaque côté est équilibré : 8 pièces ont un tenon en haut et 8 ont une encoche en haut, et il en va de même pour les autres côtés.

## Les règles

1. Placer les 16 pièces dans la grille de 4 × 4, une pièce par case.
2. **Les pièces ne peuvent pas être tournées.** Elles gardent toutes la même orientation ; sur les pièces physiques, une petite marque dans un coin indique le sens.
3. Deux pièces voisines doivent **s'emboîter** : partout où deux pièces se touchent, un tenon doit faire face à une encoche. Deux tenons ou deux encoches face à face sont interdits.
4. Le bord extérieur de la grille est libre : n'importe quel côté peut se trouver contre le bord du plateau.

Le puzzle est résolu quand les 16 pièces sont placées et que chaque contact entre voisines est un tenon face à une encoche.

## Le puzzle imprimé en 3D

<table>
  <tr>
    <td align="center"><img src="Images/3D_1.jpg" width="400"><br>Le plateau</td>
    <td align="center"><img src="Images/3D_2.jpg" width="400"><br>Les 16 pièces</td>
  </tr>
  <tr>
    <td align="center"><img src="Images/3D_3.jpg" width="400"><br>Plus qu'une pièce à placer</td>
    <td align="center"><img src="Images/3D_4.jpg" width="400"><br>Une grille résolue</td>
  </tr>
</table>

### Exemple de solution

<table>
  <tr><td align="center"><img src="Web/pieces/0.svg" width="60"></td><td align="center"><img src="Web/pieces/8.svg" width="60"></td><td align="center"><img src="Web/pieces/9.svg" width="60"></td><td align="center"><img src="Web/pieces/10.svg" width="60"></td></tr>
  <tr><td align="center"><img src="Web/pieces/1.svg" width="60"></td><td align="center"><img src="Web/pieces/11.svg" width="60"></td><td align="center"><img src="Web/pieces/3.svg" width="60"></td><td align="center"><img src="Web/pieces/5.svg" width="60"></td></tr>
  <tr><td align="center"><img src="Web/pieces/13.svg" width="60"></td><td align="center"><img src="Web/pieces/15.svg" width="60"></td><td align="center"><img src="Web/pieces/7.svg" width="60"></td><td align="center"><img src="Web/pieces/4.svg" width="60"></td></tr>
  <tr><td align="center"><img src="Web/pieces/12.svg" width="60"></td><td align="center"><img src="Web/pieces/14.svg" width="60"></td><td align="center"><img src="Web/pieces/2.svg" width="60"></td><td align="center"><img src="Web/pieces/6.svg" width="60"></td></tr>
</table>

## Pourquoi c'est plus difficile qu'il n'y paraît

Placer les premières pièces est facile : presque tout trouve sa place quelque part.
La difficulté arrive à la fin. Chaque pièce est unique, donc chacune des dernières cases exige une combinaison très précise de tenons et d'encoches, et la pièce qui a exactement cette forme est peut-être déjà utilisée ailleurs.
Résoudre le puzzle, c'est anticiper les formes dont les dernières cases auront besoin.

Une observation utile : comme chaque contact intérieur est formé d'exactement un tenon et une encoche, le bord d'une grille terminée montre toujours exactement **8 tenons et 8 encoches** :

- 4 tenons parmi les 8 côtés tournés vers les bords gauche et droit ;
- 4 tenons parmi les 8 côtés tournés vers les bords haut et bas.

Cela vient de l'équilibre du jeu : il y a 16 tenons gauche/droite au total, et les 12 contacts verticaux intérieurs en utilisent 12, ce qui en laisse 4 pour les bords. Le même raisonnement s'applique verticalement.

## Nombre de solutions

Les solutions ont été comptées par une recherche informatique exhaustive, qui a essayé tous les placements possibles.

| Mesure | Valeur |
|---|---|
| Solutions du puzzle libre | **2 765 440** |
| Solutions vraiment différentes (tourner ou retourner toute la grille donne une autre solution valide, ces solutions ne sont donc comptées qu'une fois) | **345 762** |
| Bords possibles pour une grille terminée, sur 65 536 combinaisons | **4 900** |

**Chaque pièce peut aller dans chaque case.** Placer une seule pièce, n'importe où, ne rend jamais le puzzle impossible : il reste entre 163 248 et 183 096 solutions selon la pièce et la case.

## Variantes avec contraintes

Le puzzle libre a des millions de solutions. Pour créer des défis plus difficiles ou différents, on peut ajouter des contraintes.

### Pièces déjà placées

On commence avec une ou plusieurs pièces déjà placées dans des cases données, puis on complète la grille autour.
Plus il y a de pièces imposées, moins il reste de solutions, jusqu'à ce que la grille n'ait plus qu'une seule solution.
Cela fonctionne aussi bien avec le puzzle physique qu'avec la version web.

La version web peut générer ce type de défi. Elle choisit une solution au hasard, en révèle certaines pièces, et ne garde que celles nécessaires pour atteindre la difficulté choisie. Les pièces données sont affichées en noir et ne peuvent pas être déplacées.
La difficulté dépend du nombre de solutions que laissent les pièces données : moins il y a de solutions, plus le défi est difficile.

| Difficulté | Solutions restantes | Pièces données en général |
|---|---|---|
| Easy (facile) | 200 à 1 000 | 3 à 4 |
| Medium (moyen) | 20 à 199 | 4 à 5 |
| Hard (difficile) | 2 à 19 | 5 à 6 |
| Expert | exactement 1 | 5 à 8 |

Étonnamment, un défi plus difficile ne donne pas beaucoup plus de pièces : 5 pièces bien choisies peuvent suffire à ne laisser qu'une seule solution.

### Contraintes de bord (version web uniquement)

Dans la version web, chacune des 16 positions autour de la grille peut recevoir une contrainte optionnelle :

- **désactivée** : le côté tourné vers le bord est libre (par défaut) ;
- **tenon venant du bord** : la pièce à cette position doit avoir une encoche de ce côté ;
- **encoche dans le bord** : la pièce à cette position doit avoir un tenon de ce côté.

Comme une grille terminée a toujours 4 tenons gauche/droite et 4 tenons haut/bas sur son bord, un ensemble de contraintes de bord qui ne respecte pas cette règle n'a aucune solution.

Les contraintes de bord seules ne suffisent pas à rendre une solution unique : même avec les 16 positions fixées, un bord valide laisse encore **entre 160 et 1 864 solutions**. Pour construire un puzzle à solution unique, il faut les combiner avec des pièces déjà placées.

## Contenu du dépôt

- `3D Models/plate.stl` : le plateau (135 × 135 mm), avec des repères qui délimitent les 16 cases.
- `3D Models/pieces.stl` : les 16 pièces, prêtes à imprimer.
- `Images/pieces.stl.svg` : une vue à plat des 16 pièces.
- `Web/` : la version web. Ouvrir `Web/index.html` dans un navigateur, choisir une difficulté et lancer un **New challenge**, ou jouer librement. Glisser les pièces sur la grille (ou toucher une pièce, puis une case), toucher autour de la grille pour ajouter des contraintes de bord, et utiliser **Hint**, **Solve**, **Count solutions** et **Save** pour explorer les grilles.
