import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../Error Handler/applicationError.js";
import { reviewSchema } from './reviews.schema.js';
import { productSchema } from "./product.schema.js";
import mongoose from "mongoose";
// importing category Model.
import categoryModel from "./category.schema.js";

const ProductModel = mongoose.model("products", productSchema);
const reviewModel = mongoose.model("Reviews", reviewSchema);

export default class ProductRepository {
    constructor() {
        this.collection = "products";
    }

    async add(productData) {
        try {
            productData.category = productData.category.split(',').map((i) => i.trim());
            console.log(productData)
            // 1. Add the product.
            const newProduct = new ProductModel(productData)
            const savedPeoduct = await newProduct.save();

            // 2. update the cotegories.
            await categoryModel.updateMany(
                { _id: { $in: productData.category } },
                {
                    $puch: {product: new ObjectId(savedPeoduct._id)}
                }
            )

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong. Product not added", 500);
        }
    }

    async getAll() {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find().toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong. Products not found", 500);
        }
    }

    async get(id) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            // Convert id to ObjectId using a string
            const product = await collection.findOne({ _id: new ObjectId(id) });
            if (!product) {
                throw new ApplicationError("Product not found", 404);
            }
            return product;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async filter(minPrice, maxPrice, category) {
        try {
            // 1. Get the Database
            const db = getDB();
            // 2. Get the collection
            const collection = db.collection(this.collection);

            // 3. Build the filter expression
            let filterExpretion = {};

            if (minPrice) {
                filterExpretion.price = { ...filterExpretion.price, $gte: parseFloat(minPrice) };
            }

            if (maxPrice) {
                filterExpretion.price = { ...filterExpretion.price, $lte: parseFloat(maxPrice) };
            }

            if (category) {
                filterExpretion.category = category;
            }

            // 4. Find and return the filtered products
            const filterProducts = await collection.find(filterExpretion).toArray();
            return filterProducts;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    // async rateProduct(userID, productID, rating) {
    //     try {
    //         // 1. Get the database. 
    //         const db = getDB();
    //         // 2. Get the collection.
    //         const collection = db.collection(this.collection);

    //         // 3. Update the collection
    //         // 1. Find the product.
    //         const product = await collection.findOne({ _id: new ObjectId(productID) });

    //         // 2. Check if the user has already rated the product.
    //         const userRating = product?.ratings?.find((r) => r.userID.equals(new ObjectId(userID)));

    //         if (userRating) {
    //             // Update the existing rating.
    //             await collection.updateOne(
    //                 {
    //                     _id: new ObjectId(productID),
    //                     "ratings.userID": new ObjectId(userID)
    //                 },
    //                 {
    //                     $set: {
    //                         "ratings.$.rating": rating
    //                     }
    //                 }
    //             );
    //         } else {
    //             // Add a new rating.
    //             await collection.updateOne(
    //                 { _id: new ObjectId(productID) },
    //                 {
    //                     $push: {
    //                         ratings: { userID: new ObjectId(userID), rating }
    //                     }
    //                 }
    //             );
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong", 500);
    //     }
    // }

    async rateProduct(userID, productID, rating) {
        try {
            console.log(`userID: ${userID}`);
            console.log(`productID: ${productID}`);
            console.log(`rating: ${rating}`);
    
            // 1. Check if the product exists
            const isProduct = await productModel.findById(productID);
            console.log(`isProduct: ${isProduct}`);
            if (!isProduct) {
                throw new Error("Product not found");
            }
    
            // 2. Get the user's existing review
            const userReview = await reviewModel.findOne({ 
                product: new ObjectId(productID), 
                user: new ObjectId(userID) 
            });
            console.log(`userReview: ${userReview}`);
    
            if (userReview) {
                // 3. Update the rating if review exists
                userReview.rating = rating;
                await userReview.save();
                console.log(`Updated userReview: ${userReview}`);
            } else {
                // 4. Create a new review if none exists
                const newReview = new reviewModel({
                    product: new ObjectId(productID),  // Make sure this matches the schema field
                    user: new ObjectId(userID),        // Make sure this matches the schema field
                    rating: rating
                });
                await newReview.save();
                console.log(`newReview: ${newReview}`);
            }
    
            // Optionally, update the product's average rating
            const reviews = await reviewModel.find({ product: new ObjectId(productID) });
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
    
            // Update the product's average rating
            isProduct.averageRating = averageRating;
            await isProduct.save();
    
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }
    
    

    async AveragePricePerCategory() {
    try {
        const db = getDB();
        return await db.collection(this.collection).aggregate(
            [
                {
                    $group: {
                        _id: "$category",
                        AveragePrice: { $avg: "$price" }
                    }
                }
            ]
        ).toArray();
    } catch (err) {
        console.log(err);
        throw new ApplicationError("Something went wrong", 500);
    }
}


}
