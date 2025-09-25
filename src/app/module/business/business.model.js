import mongoose from "mongoose";


const businessSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required to create a new business"]
    },
    image: {
        type: String,
        required: [true, "Business image is required"],
    },
    title: {
        type: String,
        required: [true, "Business title is required"]
    },
    //
    businessRole:{
        type: String,
        required: [true, "business role is required"],
        enum:["Seller","Francise Seller","Asset Seller","Business Idea Lister","Broker"]
    },
    category: {
        type: String,
        required: [true, "Business category is required"]
    },
    subCategory: {
        type: String,
        default: null
    },
    country: {
        type: String,
        required: [true, "Business country is required"]
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
        required: [true, "Business asking price is required"]
    },
    price:{
        type: Number,
        default: 0
    },
    ownerShipType: {
        type: String,
        required: [true, "Business ownership type is required"]
    },
    businessType: {
        type: String,
        required: [true, "Business business type is required"]
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



const BusinessModel = mongoose.models.Business || mongoose.model("Business",businessSchema);

export default BusinessModel;


