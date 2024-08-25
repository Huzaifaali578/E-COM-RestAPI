import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: Number,
    catogory: String,
    sizes: { type: Array },
    stock: Number,
    imageUrl: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ],
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    ]
})

