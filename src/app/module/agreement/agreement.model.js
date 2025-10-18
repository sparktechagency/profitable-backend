import mongoose from "mongoose";
import validator from "validator";

const agreementSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required to create new Aggrement"]
    },
    userRole:{
        type: String,
        required: [true, "User role is required to create new Aggrement"]
    },
    name:{
        type: String,
        required: [true, "Name is required to create new Aggrement"]
    },
    email:{
        type: String,
        required: [true, "Valid Email is required to create a new agreement"],
        validate:{
            validator: (value) => validator.isEmail(value),
            message: "Please provide a valid email address"
        }
    },
    phone:{
        type: Number,
        required: [true, "Mobile Number is required to create new Aggrement"],
    },
    nidPassportNumber:{
        type: String,
        required: [true, "Passport/Nid number is required to create new Aggrement"]
    },
    nda:{
        type: String,
        required: [true,"Nda pdf is required to create a new agreement"]
    },
    
},{ timestamps: true });

const Agreement = mongoose.models.Agreement || mongoose.model("Agreement", agreementSchema);

export default Agreement;