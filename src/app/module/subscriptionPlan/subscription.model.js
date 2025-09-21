import mongoose from "mongoose";


const subscriptionPlanSchema = new mongoose.Schema({
    subscriptionPlanType: {
        type: String,
        required: true,
    },
    subscriptionPlanRole:{
        type: String,
        required: true,
        enum: ["Buyer","Asset Seller","Seller","Broker","Investor","Francise Seller","Business Idea Lister"]
    },
    features: {
        type: Array,
        required: true
    },
    price: {
        type: [Number],
        required: true
    },
    duration: {
        type: String,
        // required: true,
        // enum: ["15 Days","1 Months","3 Months","6 Months"]
    }
},{ timestamps: true});

const SubscriptionPlanModel = mongoose.models.SubscriptionPlan  || mongoose.model("SubscriptionPlan", subscriptionPlanSchema);

export default SubscriptionPlanModel;