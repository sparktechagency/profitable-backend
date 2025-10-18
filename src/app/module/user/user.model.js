import mongoose from "mongoose";
import validator from "validator";


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"User name is required"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        validate:{
            validator: (value) => validator.isEmail(value),
            message: "Please provide a valid email address"
        }
    },
    password:{
        type: String,
        required: [true,"Password is required"]
    },
    confirmPassword:{
        type: String,
        
    },
    image: {
        type: String,
        default: null
    },
    profession:{
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    mobile:{
        type: Number,
        require: [true,"mobile number is required"]
    },
    country:{
        type: String,
        required: [true,"country name is required"]
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: null
    },
    verificationCodeExpire: {
        type: Date,
        default:null
    },
    role:{
        type: String,
        required: [true, "User's role is required to complete register"],
        enum: ["Admin","Buyer","Seller","Investor","Broker","Asset Seller","Francise Seller","Business Idea Lister"]
    },
    isOnline:{
        type: Boolean,
        default: false
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    totalBusiness:{
        type: Number,
        default: 0
    },
    subscriptionPlan:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        default: null
    },
    subscriptionPlanPrice:{
        type: Number,
        default: null
    },
    subscriptionPlanType:{
        type: String,
        default: null
    },
    subscriptionStartDate:{
        type: Date,
        default: null
    },
    subscriptionEndDate:{
        type: Date,
        default: null
    },
},{
    timestamps: true
});

const UserModel = mongoose.models.User || mongoose.model("User",userSchema);

export default UserModel;