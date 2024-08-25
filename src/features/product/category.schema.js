import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: String,
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

const categoryModel = mongoose.model("Category", categorySchema);  // Corrected capitalization

export default categoryModel;
