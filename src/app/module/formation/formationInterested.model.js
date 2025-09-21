import mongoose from "mongoose";


const interestedSchema = new mongoose.Schema({
    formationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: [true, "Business Id is required to create new Interested"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required to create new Interested"]
    },
    //  businessRole:{
    //     type: String,
    //     required: [true, "business role is required"],
    //     enum:["Sellers-business","Franchise","Asset-seller","Business-Idea-lister","Broker-business"]
    // },
    name :{
        type: String,
       
    },
    countryCode:{
        type: String,
    },
    mobile :{
        type: String,
        // required: true
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


const FormationInterestedModel = mongoose.models.FormationInterested || mongoose.model("FormationInterested",interestedSchema);

export default FormationInterestedModel;