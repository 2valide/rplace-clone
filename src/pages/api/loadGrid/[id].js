// Ce fichier définit un gestionnaire d'API pour récupérer les données d'une grille.

// Importation de la fonction de connexion à la base de données MongoDB.
import { connectToDatabase } from '../../../../lib/utils/mongodb/db.js';

// Le gestionnaire de requêtes asynchrones pour les requêtes GET vers '/api/grid/{id}'.
export default async function handler(req, res) {
    // Récupération de l'ID de grille depuis la requête.
    const { id } = req.query;

    try {
        // Connexion à la base de données MongoDB.
        const { db } = await connectToDatabase();

        // Recherche de la grille par son identifiant.
        const grid = await db.collection("grids").findOne({ gridId: id });

        // Si la grille n'est pas trouvée, renvoie une erreur 404.
        if (!grid) {
            console.log("No grid found for ID:", id);
            return res.status(404).json({ message: 'Grid not found' });
        }

        // Si la grille est trouvée, renvoie les données de la grille avec un statut 200.
        res.status(200).json(grid);
    } catch (error) {
        // En cas d'erreur pendant la requête à la base de données, renvoie une erreur 500.
        console.error("Error loading grid:", error);
        res.status(500).json({ message: 'Failed to load grid', error: error.message });
    }
}
