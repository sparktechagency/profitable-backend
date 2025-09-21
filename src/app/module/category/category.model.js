import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

    categoryName:{
        type: String,
        required: [true, "Category name is required to create a new category"]
    },
    categoryImage:{
        type: String,
        required: [true, "Category image is required to create a new category"]
    },
    subCategories:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        default: []
    }]
},{ timestamps: true });

const CategoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default CategoryModel;