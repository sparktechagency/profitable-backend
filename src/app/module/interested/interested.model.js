import mongoose from "mongoose";


const interestedSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: [true, "Business Id is required to create new Interested"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required to create new Interested"]
    },
     businessRole:{
        type: String,
        required: [true, "business role is required"],
        enum:["Seller","Francise Seller","Asset Seller","Business Idea Lister","Broker"]
    },
    userRole:{
        type: String,
    },
    name :{
        type: String,
       
    },
    countryCode:{
        type: String,
    },
    mobile :{
        type: String,
        required: [true, "Mobile number is required"]
    },
    sector :{
        type: String,
        // required: true
    },
    activity :{
        type: String,
        // required: true
    },
    email :{
        type: String,
        // required: true
    },
    serviceZone :{
        type: String,
        // required: true
    },
    message :{
        type: String,
        // required: true
    },

},{timestamps: true});


const InterestedModel = mongoose.models.Interested || mongoose.model("Interested",interestedSchema);

export default InterestedModel;