# NoirMotors — site vitrine automobile de luxe

Site statique (HTML / CSS / JavaScript natifs, aucune dépendance). Ouvrir `index.html` suffit.

## Structure
- `index.html` : sections Accueil (McLaren rouge, feux arrière allumés à chaque chargement), La maison, Collection, L'expérience, Performance, Guide (étapes + FAQ), Contact, fiche détaillée (`<dialog id="fiche">`).
- `style.css` : styles par couches (v2 navigation, v4 projecteurs/thème, v6 photos, v7 phares colorés et documentation). Palette : rouge `#E02030`, noir `#080808`, gris `#858585`.
- `script.js` : interactions, tableau `CARS` (la collection), fiches, filtres, thème clair/sombre.
- `assets/` : logo, favicon, icônes SVG et photos.

## Ajouter ou modifier une voiture
Chaque entrée du tableau `CARS` (dans `script.js`) contient : `name`, `desc`, `tag`, `cat` (`super`, `sport`, `gt`, `limited`, séparés par des espaces), `yr`, `eng`, `pw`, `tq`, `tr`, `ac`, `vm`, `wt`, `about`, `hi` (points forts), `img`, `w3`, ainsi que :
- `lc` : couleur des phares et du halo (hexadécimal), à accorder à la voiture ;
- `fl` : positions des phares `[x %, y %, taille %]` dans la photo 4:3.

## Images
- Hero et bannière : 1280 / 1920 / 2560 / 3840 px (`srcset`). Cartes : 800 / 1200 / 1800 px, recadrées en 4:3 et affûtées après réduction.
- Les lumières « du haut » ont été retirées ; restent les phares, le reflet et un léger halo au sol de la couleur du véhicule.

## Accessibilité et performance
Respect de `prefers-reduced-motion`, navigation clavier (Entrée pour allumer, Échap pour fermer une fiche), images différées (`loading="lazy"`), thème clair/sombre mémorisé.

## Données techniques
Valeurs constructeur indicatives (puissance, couple, 0–100 km/h, vitesse maximale, poids à sec). Elles varient selon la version et les options ; « n.c. » signifie non communiqué. À vérifier avant toute publication commerciale.

## Crédits photos (Unsplash)
Robert Schwarz, Mo, Jack Lucas Smith (2 photos), Yuvraj Singh, Flavien, Tyler H., Avenir Visuals, Tyler Clemmensen, Cash Macanaya, Roberto Nickson, Stefano Romanello, Olav Tvedt. Licence Unsplash. Les marques et logos visibles sur les véhicules restent la propriété de leurs détenteurs.

## Accueil
La photo `hero-red-*` est placée dans `.hero-stage`, qui garde son ratio 3:2 : les feux (`.flare`, positions en % de l'image) restent alignés sur les feux arrière quel que soit l'écran. La couleur vient de `--lc`. Ils s'allument à chaque chargement de la page.
