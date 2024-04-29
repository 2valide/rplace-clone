const { MongoClient } = require('mongodb');

async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    return { db, client };
}


module.exports = { connectToDatabase };
