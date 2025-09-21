import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email id is required to subscribe"]
    }
},{ timestamps: true });


const SubscriberModel = mongoose.models.SubscriberList || mongoose.model("SubscriberList",subscriberSchema);

export default SubscriberModel;