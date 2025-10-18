import mongoose from "mongoose";


const couponUsedSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"User id is required"]
    },
    coupon:{
        type: String,
        required: [true, "Coupon code is required"]
    }
},{timestamps: true});

const CouponUsedModel = mongoose.models.CouponUse || mongoose.model("CouponUse",couponUsedSchema);

export default CouponUsedModel;