import mongoose from "mongoose";


const termsAndConditionSchema = new mongoose.Schema({
    description:{
        type: String
    }
});

const termsAndConditionModel = mongoose.models.TermsAndCondition || mongoose.model("TermsAndCondition", termsAndConditionSchema);

export default termsAndConditionModel;