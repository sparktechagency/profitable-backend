import mongoose from "mongoose";


const privacyPolicySchema = new mongoose.Schema({
    description:{
        type: String
    }
});

const privacyPolicyModel = mongoose.models.PrivacyPolicy || mongoose.model("PrivacyPolicy", privacyPolicySchema);

export default privacyPolicyModel;