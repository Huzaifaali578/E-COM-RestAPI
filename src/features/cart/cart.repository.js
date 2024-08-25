import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../Error Handler/applicationError.js";

export default class CartRepository {
    constructor() {
        this.collection = "cartItems";
    }

    async add(productID, userID, quantity) {
        try {
            console.log(productID, quantity);
            const db = getDB();
            const collection = db.collection(this.collection);
    
            // Check if the cart item already exists
            const existingItem = await collection.findOne({
                productID: new ObjectId(productID),
                userID: new ObjectId(userID),
            });
    
            let id;
    
            // If the item doesn't exist, generate a new ID
            if (!existingItem) {
                id = await this.getNextCounter(db);
    
                if (!id) {
                    throw new ApplicationError("Generated ID is null or undefined", 500);
                }
    
                // Insert a new item with the generated ID
                await collection.updateOne(
                    { productID: new ObjectId(productID), userID: new ObjectId(userID) },
                    { $setOnInsert: { _id: id }, $inc: { quantity: quantity } },
                    { upsert: true }
                );
            } else {
                // If the item exists, just update the quantity
                await collection.updateOne(
                    { productID: new ObjectId(productID), userID: new ObjectId(userID) },
                    { $inc: { quantity: quantity } }
                );
            }
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }
    
    

    async get(userID) {
        try {
            // 1. Get the database.
            const db = getDB();
            // 2. Get the Collection.
            const collection = db.collection(this.collection);
            // 3. find Cart Items.
            return await collection.find({ userID: new ObjectId(userID) }).toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async delete(cartItemID, userID) {
        try {
            // 1. Get the database.
            const db = getDB();
            // 2. Get the Collection.
            const collection = db.collection(this.collection);
            // 3. delete the cart Items.
            const result = await collection.deleteOne({ _id: new ObjectId(cartItemID), userID: new ObjectId(userID) });
            return result.deletedCount > 0;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async getNextCounter(db) {
        try {
            const result = await db.collection("counters").findOneAndUpdate(
                { _id: "cartItemID" },
                { $inc: { value: 1 } },
                { returnDocument: "after" }
            );
    
            console.log("Result from findOneAndUpdate:", result);
    
            if (!result.value) {
                throw new ApplicationError("Failed to get next counter value", 500);
            }
    
            console.log("Generated ID:", result.value);
    
            return result.value;
        } catch (err) {
            console.error("Error in getNextCounter:", err);
            throw new ApplicationError("Counter generation failed", 500);
        }
    }
    
}
