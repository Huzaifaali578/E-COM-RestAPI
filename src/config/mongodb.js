import { MongoClient } from "mongodb";
import { ApplicationError } from "../Error Handler/applicationError.js";

const url = process.env.DB_URL;
let client;

export const connectToMongoDB = async () => {
    try {
        client = await MongoClient.connect(url);
        console.log("MongoDB is connected");
        createCounter(client.db()); // Ensure this waits for completion
        createIndex(client.db());
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        throw new Error("Database connection failed");
    }
};

export const getClient = () => {
    return client;
}

export const getDB = () => {
    if (!client) {
        throw new Error("Database not initialized. Please connect to the database first.");
    }
    return client.db();
};


const createCounter = async (db) => {
    try {
        const existingCounter = await db.collection("counters").findOne({ _id: "cartItemID" });
        if (!existingCounter) {
            await db.collection("counters").insertOne({ _id: "cartItemID", value: 0 });
            console.log("Counter initialized");
        } else {
            console.log("Counter already exists");
        }
    } catch (err) {
        console.error("Failed to create counter:", err);
        throw new Error("Counter initialization failed");
    }
};

const createIndex = async (db) => {
    try {
        await db.collection("products").createIndex({ price: 1 }); // single field index
        await db.collection("products").createIndex({ name: 1, category: -1 }); // compound index
        await db.collection("products").createIndex({ desc: "text" }); // text index
    } catch (err) {
        throw new ApplicationError(`createIndexError: ${err.message}`)
    }
    console.log("Indexes are created")
    console.log("Indexes are created")
}

