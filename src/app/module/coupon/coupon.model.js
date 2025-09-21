import mongoose from "mongoose"


const couponSchema = new mongoose.Schema({
    couponCode:{
        type: String,
        required: true
    },
    reason:{
        type: String,
        required: true
    },
    discount:{
        type: Number,
        required: true
    },
    validFrom:{
        type: Date,
        required: true
    },
    validTo:{
        type: Date,
        required: true
    },
    usageLimit:{
        type: String,
        default: "unlimited"
    },
    status:{
        type: String,
        enum: ["Active","Expired"],
        default: "Active"
    },
    couponUsesCount:{
        type: Number,
        default: 0
    }

},{ timestamps: true });

const CouponModel = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default CouponModel;