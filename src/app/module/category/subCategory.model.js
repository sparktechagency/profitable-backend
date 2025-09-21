import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: { 
     type: String,
     required: true 
  },
  category: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Category",
     required: true 
  }
});

const SubCategoryModel = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);

export default SubCategoryModel;


/*
const userSchema = new mongoose.Schema({
  name: String,
  email: String
}, { versionKey: false, _id: false }); // 👈 this removes _id globally

*/