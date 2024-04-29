// Importation de la fonction de connexion à la base de données MongoDB.
import { connectToDatabase } from '../../../../lib/utils/mongodb/db.js';

// La fonction 'handler' est l'API endpoint de Next.js qui gère les requêtes entrantes.
export default async function handler(req, res) {
    // Récupération de l'ID de la grille depuis la requête, attendue dans l'URL comme `/api/route?id=123`.
    const { id } = req.query;

    // Récupération des données de la grille envoyées avec la requête. 'grid' est supposé être
    // un tableau d'objets avec la structure { key, value, nick }.
    const { grid } = req.body;

    try {
        // Connexion à la base de données MongoDB.
        const { db } = await connectToDatabase();

        // Recherche dans la collection 'grids' d'un document avec l'ID spécifié.
        const document = await db.collection("grids").findOne({ gridId: id });

        // Création des nouvelles entrées avec l'ajout d'un timestamp ISO pour chaque entrée.
        const newEntries = grid.map(entry => ({
            ...entry,
            timestamp: new Date().toISOString()
        }));

        // Si le document avec l'ID spécifié n'existe pas déjà dans la collection,
        // un nouveau document est créé avec les nouvelles entrées et un timestamp de création.
        if (!document) {
            await db.collection("grids").insertOne({
                gridId: id,
                createdAt: new Date().toISOString(),
                grid: newEntries
            });
            // Réponse HTTP avec un statut 201 pour indiquer que la ressource a été créée avec succès.
            res.status(201).json({ message: "Grid created with initial entries." });
        } else {
            // Si un document existe déjà, cette portion de code filtre les nouvelles entrées
            // pour ne garder que celles qui n'ont pas de doublon de 'key' et 'value' dans la grille existante.
            const gridUpdates = newEntries.filter(newEntry => {
                return !document.grid.some(existingEntry =>
                    existingEntry.key === newEntry.key && existingEntry.value === newEntry.value
                );
            }).map(newEntry => {
                // Création d'un objet 'updateOne' pour chaque nouvelle entrée unique.
                // Ce sera utilisé dans une opération de 'bulkWrite' pour la mise à jour en masse.
                return {
                    updateOne: {
                        filter: { gridId: id },
                        update: { $push: { grid: newEntry } }
                    }
                };
            });

            // Si il y a des mises à jour à effectuer, 'bulkWrite' les exécute toutes en une seule opération.
            if (gridUpdates.length > 0) {
                await db.collection("grids").bulkWrite(gridUpdates);
            }

            // Réponse HTTP avec un statut 200 pour indiquer que la grille a été mise à jour avec succès.
            res.status(200).json({ message: "Grid updated with new entries." });
        }
    } catch (error) {
        // Si une erreur se produit pendant le processus, on la capture ici et on répond avec un statut 500.
        console.error("Error updating grid:", error);
        res.status(500).json({ error: error.message });
    }
}
