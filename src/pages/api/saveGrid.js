import { connectToDatabase } from '../../../lib/utils/mongodb/db.js';

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         console.log('Received grid data:', req.body.grid);
//         try {
//             const { db, client } = await connectToDatabase();
//             const collection = db.collection('grids');
//             await collection.updateOne(
//                 { id: 'main_grid' },
//                 { $set: { grid: req.body.grid } },
//                 { upsert: true }
//             );
//             await client.close();
//             res.status(200).json({ message: 'Grid state saved successfully.' });
//         } catch (error) {
//             console.error(error); // Imprimer l'erreur dans les logs du serveur
//             res.status(500).json({ message: 'Server error', error: error.message });
//         }
//     } else {
//         res.status(405).json({ error: 'Method not allowed' });
//     }
// }

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const { grid, nick } = req.body; // Récupère le grid et le nick du corps de la requête

            // Tu peux ajouter une validation ici pour le nick si nécessaire

            const collection = db.collection('pixels');
            await collection.insertMany(grid.map(pixel => ({
                ...pixel,
                nick: nick, // Stocke le nick avec chaque pixel
            })));

            res.status(200).json({ message: 'Grid saved successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}
