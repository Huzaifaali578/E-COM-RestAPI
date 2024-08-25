import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../Error Handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
    constructor() {
        this.collection = "orders";
    }

    async placeOrder(userID) {
        const client = getClient();
        const session = client.startSession();

        try {
            session.startTransaction();
            const db = getDB();
            
            // 1. Get cartItems and calculate total amount.
            const items = await this.getTotalAmount(userID, session);

            // Calculate the final total amount
            const finalTotalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0);
            console.log(finalTotalAmount);

            // 2. Create an order record.
            const newOrder = new OrderModel(new ObjectId(userID), finalTotalAmount, new Date());
            const orderResult = await db.collection(this.collection).insertOne(newOrder, { session });

            // 3. Reduce the stock.
            for (let item of items) {
                await db.collection("products").updateOne(
                    { _id: item.productID },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            // 4. Clear the cart items.
            await db.collection("cartItems").deleteMany(
                { userID: new ObjectId(userID) },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
            
            return orderResult; // Return the order result or a success message
            
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error(err);
            throw new ApplicationError("Something went wrong while placing the order.");
        }
    }

    async getTotalAmount(userID, session) {
        const db = getDB();
        const items = await db.collection("cartItems").aggregate([
            // 1. Get Cart Item from the userID.
            { $match: { userID: new ObjectId(userID) } },
            // 2. Get product from the product collection.
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            // 3. Unwind the productInfo.
            { $unwind: "$productInfo" },
            // 4. Calculate totalAmount for each cartItem.
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            }
        ], { session }).toArray();
        
        console.log(items);
        return items;
    }
}
