import mongoose from "mongoose";
import slugify from "slugify";


const businessSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required to create a new business"]
    },
    image: {
        type: String,
        required: [true, "Business image is required to list a new business"],
    },
    title: {
        type: String,
        required: [true, "Business title is required to list a new business"]
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    businessRole:{
        type: String,
        required: [true, "business role is required to list new business"],
        enum:["Seller","Francise Seller","Asset Seller","Business Idea Lister","Broker"]
    },
    category: {
        type: String,
        required: [true, "Business category is required to list anew business"]
    },
    subCategory: {
        type: String,
        default: null
    },
    country: {
        type: String,
        required: [true, "Business country is required to list a new business"]
    },
    state: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    countryName: {
        type: String,
        default: null
    },
    askingPrice: {
        type: String,
        required: [true, "Business asking price is required to list a new business"]
    },
    price:{
        type: Number,
        default: 0
    },
    ownerShipType: {
        type: String,
        required: [true, "Business ownership type is required to list a new business"]
    },
    businessType: {
        type: String,
        required: [true, "Business type is required to list a new business"]
    },
    reason: {
        type: String
    },
    description: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isSold:{
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0,
    }
},{timestamps: true});

businessSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});



const BusinessModel = mongoose.models.Business || mongoose.model("Business",businessSchema);

export default BusinessModel;


