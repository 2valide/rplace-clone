import { connectToDatabase } from '../../../../lib/utils/mongodb/db.js';

export default async function handler(req, res) {
    const { id } = req.query;
    try {
        const { db } = await connectToDatabase();
        const grid = await db.collection("grids").findOne({ gridId: id });

        if (!grid) {
            console.log("No grid found for ID:", id);
            return res.status(404).json({ message: 'Grid not found' });
        }

        const timeCreated = grid.createdAt;
        const timeNow = new Date();
        const threeHours = 3 * 60 * 60 * 1000; // 3 heures en millisecondes tset
        const isLocked = timeNow - new Date(timeCreated) > threeHours;

        res.status(200).json({ ...grid, isLocked });
    } catch (error) {
        console.error("Error loading grid:", error);
        res.status(500).json({ message: 'Failed to load grid', error: error.message });
    }
}



