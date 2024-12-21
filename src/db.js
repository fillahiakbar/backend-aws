// db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

async function connectToDatabase() {
    if (!db) {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        db = client.db('workoutApp');
    }
    return db;
}

module.exports = { connectToDatabase };
