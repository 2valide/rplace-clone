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

Bien sûr, voici une section détaillée pour documenter l'API de votre application r/place, en se basant sur les informations fournies. Vous pouvez ajouter cette section à votre fichier `README.md` pour offrir une description claire des points d'accès de l'API aux utilisateurs et développeurs.

## API Documentation

Cette section décrit les endpoints de l'API disponibles pour interagir avec la grille r/place.

### Endpoints

#### 1. Obtenir l'état de la grille

**GET `/api/grid/{id}`**

Récupère les données d'une grille spécifique par son identifiant unique.

- **URL Params**

  - `id` : ID de la grille à récupérer.

- **Réponse**

  - `200 OK` : Renvoie les données de la grille.
  - `404 Not Found` : Aucune grille trouvée avec l'ID spécifié.
  - `500 Internal Server Error` : Erreur serveur lors de la récupération des données.

- **Exemple de Réponse**

  ```json
  {
    "gridId": "ffa",
    "createdAt": "2024-04-29T20:30:58.980+00:00",
    "grid": [
      {
        "key": "320,340",
        "value": "#ff0000",
        "nick": "user123"
      }
    ]
  }
  ```

````

#### 2. Mettre à jour un pixel sur la grille

**POST `/api/grid/{id}`**

Permet à un utilisateur de mettre à jour un pixel sur la grille spécifiée par son ID.

- **URL Params**

  - `id` : ID de la grille où le pixel est mis à jour.

- **Données Requises**

  - `grid` : Tableau d'objets contenant les pixels à mettre à jour (chaque objet contient `key`, `value`, `nick`).

- **Réponse**

  - `200 OK` : Le pixel a été mis à jour avec succès.
  - `404 Not Found` : Aucune grille trouvée avec l'ID spécifié pour la mise à jour.
  - `500 Internal Server Error` : Erreur serveur lors de la mise à jour des pixels.

- **Exemple de Requête**

  ```bash
  curl -X POST "http://localhost:3000/api/grid/{id}" -H "Content-Type: application/json" -d '{
    "grid": [
      {
        "key": "100,200",
        "value": "#ffffff",
        "nick": "username"
      }
    ]
  }'
  ```

Ce modèle de documentation d'API fournit des informations claires sur les fonctionnalités disponibles via l'API, comment les utiliser, et des exemples de requêtes et de réponses. Vous pouvez ajuster les détails selon les spécifications exactes et les règles métier de votre application.

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
````
