import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";

const likeModel = mongoose.model('Like', likeSchema)

export default class LikeRepository {

    async getLike(type, id) {
        try {
            return await likeModel.find({
                likeable: new ObjectId(id),
                types: type
            }).populate('user').populate({path: "likeable", model: type})
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong. Product not added", 500);
        }
    }

    async likeProduct(userID, productID) {
            try {
                const newLike = new likeModel({
                    user: new ObjectId(userID),
                    likeable: new ObjectId(productID),
                    types: 'Product'
                })
                await newLike.save();

            } catch (err) {
                console.log(err);
                throw new ApplicationError("Something went wrong. Product not added", 500);
            }
        }

    async likeCategory(userID, categoryID) {
            try {
                const newLike = new likeModel({
                    user: new ObjectId(userID),
                    likeable: new ObjectId(categoryID),
                    types: 'Category'
                })
                await newLike.save();
            } catch (err) {
                console.log(err);
                throw new ApplicationError("Something went wrong. Product not added", 500);
            }
        }
    }