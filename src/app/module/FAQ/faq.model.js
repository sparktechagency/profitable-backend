import mongoose from "mongoose";


const faqSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
   role:{
      type: String,
      enum: ["Admin","Buyer","Seller","Investor","Broker","Asset Seller","Francise Seller","Business Idea Lister"],
      required: true
    },
},{ timestamps: true});

const FaqModel = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);

export default FaqModel;