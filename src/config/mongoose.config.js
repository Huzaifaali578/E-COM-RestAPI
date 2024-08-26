import mongoose from "mongoose";
import categoryModel from "../features/product/category.schema.js";

const url = process.env.DB_URL;
console.log(url)

export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log("Mongodb connected using mongoose");
        await addCategory();  // Ensure this is awaited
    } catch (err) {
        console.log("Error while connecting to db");
        console.log(err);
    }
}

async function addCategory() {
    const category = await categoryModel.find();
    if (!category || category.length === 0) {  // Corrected 'lenght' to 'length'
        await categoryModel.insertMany([{ name: "book" }, { name: "Clothing" }, { name: "Electronics" }]);
        console.log("Categories are added");
    } else {
        console.log("Categories already exist");
    }
}
