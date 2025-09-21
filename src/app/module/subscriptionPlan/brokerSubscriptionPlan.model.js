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
    price: [{
        duration: {
            type: String,
            required: true,
            enum: ["15 Days", "1 Months", "3 Months", "6 Months"]
        },
        price: {
            type: Number,
            required: true
        }
    }],
    
},{ timestamps: true});

const brokerSubscriptionPlanModel = mongoose.models.BrokerSubscriptionPlan  || mongoose.model("BrokerSubscriptionPlan", subscriptionPlanSchema);

export default brokerSubscriptionPlanModel;