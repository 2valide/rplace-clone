import { connectToDatabase } from '../../../lib/utils/mongodb/db.js';

// export default async function handler(req, res) {
//     if (req.method === 'GET') {
//         try {
//             const { db, client } = await connectToDatabase();
//             const collection = db.collection('grids');
//             const gridState = await collection.findOne({ id: 'main_grid' });
//             await client.close();
//             res.status(200).json(gridState);
//         } catch (error) {
//             console.error(error); // Imprimer l'erreur dans les logs du serveur
//             res.status(500).json({ message: 'Server error', error: error.message });
//         }
//     } else {
//         res.status(405).json({ error: 'Method not allowed' });
//     }
// }

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('pixels');

            // Supposons que tu veuilles récupérer tous les pixels
            const pixels = await collection.find({}).toArray();  // Assure-toi d'ajouter des filtres si nécessaire

            res.status(200).json({ grid: pixels });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}