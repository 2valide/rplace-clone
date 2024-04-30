# r/place

Le projet r/place est une application Web interactive permettant aux utilisateurs de collaborer en temps réel pour créer une mosaïque de pixels colorés. Chaque utilisateur peut placer un pixel sur une grille partagée après un cooldown, similaire au célèbre subreddit r/place.

## Fonctionnalités

- Utilisateurs peuvent placer des pixels sur une grille interactive.
- Chaque pixel peut être de couleur différente.
- Système de cooldown pour limiter la fréquence de placement des pixels par utilisateur.
- Historique complet de toutes les actions pour permettre le suivi et potentiellement revenir en arrière.

## Technologies Utilisées

- **Next.js** : Pour le SSR (Server-Side Rendering) et la génération de routes API.
- **MongoDB** : Pour stocker la grille et l'historique des modifications de chaque pixel.

## Prérequis

Assurez-vous d'avoir installé les outils suivants sur votre machine :

- [Node.js](https://nodejs.org/) (v12 ou supérieur)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/downloads) (pour le clonage du dépôt)

## Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/yourusername/r-place.git
cd r-place
npm install
```
