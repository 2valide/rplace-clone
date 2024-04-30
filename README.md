# r/place

Le projet r/place est une application Web interactive qui permet aux utilisateurs de collaborer (ou non) en temps réel pour créer des pixelart ou juste posé sont pixel colorés. Chaque utilisateur peut placer un pixel sur une grille partagée après un cooldown, similaire au célèbre subreddit r/place.

## Fonctionnalités

- **Placement de Pixels**: Les utilisateurs peuvent placer des pixels sur une grille interactive.
- **Cooldown**: Un système de cooldown limite la fréquence à laquelle les utilisateurs peuvent placer des pixels.
- **Historique des Modifications**: Chaque modification de pixel est enregistrée, permettant un suivi complet des actions.

## Technologies Utilisées

- **Next.js**: Utilisé pour le rendu côté serveur (SSR) et la gestion des routes API.
- **MongoDB**: Utilisé pour stocker les données de la grille et l'historique des modifications.

## Prérequis

Vous devez avoir installé les outils suivants pour exécuter ce projet :

- [Node.js](https://nodejs.org/) (Version 12 ou plus récente)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/downloads)

## Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/2valide/rplace-clone/
cd r-place
npm install
```

## Configuration

Copiez le fichier `.env.example` en `.env` et configurez les variables d'environnement selon votre environnement local :

```bash
cp .env.example .env
```

Assurez-vous de définir les variables suivantes dans votre `.env` :

- `<MONGODB_URI>`: Votre chaîne de connexion à MongoDB.
- `<DB_NAME>`: URL de l'API pour les appels côté client, si différente de l'URL de base.

## Lancement du Projet

Pour démarrer le serveur en mode développement :

```bash
npm run dev
```

Pour construire et démarrer en mode production :

```bash
npm run build
npm start
```

## Utilisation de l'API

### Obtenir l'État Actuel de la Grille

```bash
curl -X GET "http://localhost:3000/api/grid/{id}" -H "Accept: application/json"
```

### Mettre à Jour un Pixel

```bash
curl -X POST "http://localhost:3000/api/grid/{id}" -H "Content-Type: application/json" -d '{ "grid": [{"key": "100,200", "value": "#ffffff", "nick": "username"}]}'
```

```bash
npm test
```

## Licence

Ce projet est distribué sous la licence MIT.

## Contact

Votre Anthony ZHAO – a_zhao1@hetic.eu

Lien du projet : [https://github.com/2valide/rplace-clone/](https://github.com/2valide/rplace-clone/)
