// import { connectToDatabase } from '../../../../lib/utils/mongodb/db.js';

// export default async function handler(req, res) {
//     const { id } = req.query; // Récupération de l'ID de la grille depuis la requête
//     const { grid, nick } = req.body; // Récupération des données envoyées avec la requête

//     try {
//         const { db } = await connectToDatabase(); // Connexion à la base de données

//         // Recherche d'une grille existante avec l'ID spécifié
//         const existingGrid = await db.collection("grids").findOne({ gridId: id });

//         if (!existingGrid) {
//             // Si la grille n'existe pas, elle est créée avec un timestamp
//             await db.collection("grids").insertOne({
//                 gridId: id,
//                 createdAt: new Date(),
//                 grid,
//                 nick
//                 // Vous pouvez ajouter d'autres propriétés si nécessaire
//             });
//             res.status(201).json({ message: "Grid created successfully" }); // Réponse pour la création
//         } else {
//             // Si la grille existe déjà, mise à jour des informations
//             await db.collection("grids").updateOne(
//                 { gridId: id },
//                 { $set: { grid, nick } }
//             );
//             res.status(200).json({ message: "Grid updated successfully" }); // Réponse pour la mise à jour
//         }
//     } catch (error) {
//         // Gestion des erreurs éventuelles lors des interactions avec la base de données
//         res.status(500).json({ error: error.message });
//     }
// }

import { connectToDatabase } from '../../../../lib/utils/mongodb/db.js';

export default async function handler(req, res) {
    const { id } = req.query;
    const { grid, nick } = req.body;

    try {
        const { db } = await connectToDatabase();

        // Structure de la nouvelle entrée de grille.
        const newEntries = grid.map(entry => ({
            ...entry,
            nick: nick,
            timestamp: new Date().toISOString()
        }));

        // Recherche d'une grille existante avec l'ID spécifié.
        const existingGrid = await db.collection("grids").findOne({ gridId: id });

        if (!existingGrid) {
            // Si la grille n'existe pas, elle est créée.
            await db.collection("grids").insertOne({
                gridId: id,
                createdAt: new Date().toISOString(),
                grid: newEntries // Utilisation de la nouvelle structure des entrées.
            });
            res.status(201).json({ message: "Grid created successfully with initial entries." });
        } else {
            // Mise à jour de la grille existante avec les nouvelles entrées.
            await db.collection("grids").updateOne(
                { gridId: id },
                { $push: { grid: { $each: newEntries } } } // Utilisation de $each pour ajouter plusieurs entrées.
            );
            res.status(200).json({ message: "Grid updated successfully with new entries." });
        }
    } catch (error) {
        console.error("Error saving/updating grid:", error);
        res.status(500).json({ error: error.message });
    }
}
