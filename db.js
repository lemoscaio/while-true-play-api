import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DATABASE);
    console.log("Database connection was successful.");
} catch (e) {
    console.log("Database connection was unsuccessful.", e);
}

export default db;