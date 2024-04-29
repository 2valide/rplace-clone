import { connectToDatabase } from '../../../../lib/utils/mongodb/db.js';

export default async function handler(req, res) {
    const { id } = req.query;
    const { grid } = req.body;

    try {
        const { db } = await connectToDatabase();


        const document = await db.collection("grids").findOne({ gridId: id });


        const newEntries = grid.map(entry => ({
            ...entry,
            timestamp: new Date().toISOString()
        }));

        if (!document) {

            await db.collection("grids").insertOne({
                gridId: id,
                createdAt: new Date().toISOString(),
                grid: newEntries
            });
            res.status(201).json({ message: "Grid created with initial entries." });
        } else {

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


            if (gridUpdates.length > 0) {
                await db.collection("grids").bulkWrite(gridUpdates);
            }

            res.status(200).json({ message: "Grid updated with new entries." });
        }
    } catch (error) {
        console.error("Error updating grid:", error);
        res.status(500).json({ error: error.message });
    }
}
