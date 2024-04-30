// Importation de la fonction de connexion à la base de données MongoDB.
import { connectToDatabase } from '../../../../lib/utils/mongodb/db.js';

// La fonction 'handler' est l'API endpoint de Next.js qui gère les requêtes entrantes.
export default async function handler(req, res) {
    const { id } = req.query; // Récupération de l'ID de la grille depuis la requête, attendue dans l'URL comme `/api/route?id=123`.
    const { grid } = req.body; // Récupération des données de la grille envoyées avec la requête.

    // Vérification rapide pour s'assurer que toutes les entrées sont valides
    if (grid.some(entry => !entry.key || !entry.value)) {
        return res.status(400).json({ message: "Missing key or value in some grid entries." });
    }

    try {
        const { db } = await connectToDatabase(); // Connexion à la base de données MongoDB.

        // Recherche dans la collection 'grids' d'un document avec l'ID spécifié.
        const document = await db.collection("grids").findOne({ gridId: id });

        // Création des nouvelles entrées avec l'ajout d'un timestamp ISO pour chaque entrée.
        const newEntries = grid.map(entry => ({
            ...entry,
            timestamp: new Date().toISOString()
        }));

        if (!document) {
            // Si le document avec l'ID spécifié n'existe pas déjà dans la collection,
            // un nouveau document est créé avec les nouvelles entrées et un timestamp de création.
            await db.collection("grids").insertOne({
                gridId: id,
                createdAt: new Date().toISOString(),
                grid: newEntries
            });
            res.status(201).json({ message: "Grid created with initial entries." });
        } else {
            // Filtrage des nouvelles entrées pour éviter les doublons de clé et valeur.
            const gridUpdates = newEntries.filter(newEntry => {
                return !document.grid.some(existingEntry =>
                    existingEntry.key === newEntry.key && existingEntry.value === newEntry.value
                );
            }).map(newEntry => {
                return {
                    updateOne: {
                        filter: { gridId: id },
                        update: { $push: { grid: newEntry } }
                    }
                };
            });

            // Exécution des mises à jour si nécessaire.
            if (gridUpdates.length > 0) {
                await db.collection("grids").bulkWrite(gridUpdates);
                res.status(200).json({ message: "Grid updated with new entries." });
            } else {
                res.status(200).json({ message: "No new entries needed to update." });
            }
        }
    } catch (error) {
        console.error("Error updating grid:", error);
        res.status(500).json({ error: error.message });
    }
}
