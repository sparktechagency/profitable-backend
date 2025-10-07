import mongoose from "mongoose";


const refundSchema = new mongoose.Schema({
    description:{
        type: String
    }
});

const RefundCancellationModel = mongoose.models.RefundPolicy || mongoose.model("RefundPolicy", refundSchema);

export default RefundCancellationModel;