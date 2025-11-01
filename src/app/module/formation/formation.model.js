import mongoose from "mongoose";


const formationSchema = new mongoose.Schema({

    image: {
        type: String,
        required: [true,"Format image is required"]
    },
    title: {
        type: String,
        required: [true, "Format title is required"]
    },
    detail: {
        type: String,
        required: [true, "Format details are required"]
    },
    metaTitle: {
      type: String,
      trim: true,
    // maxlength: [60, "Meta title should not exceed 60 characters"], 
      // good SEO practice
    },
    metaDescription: {
      type: String,
      trim: true,
    //maxlength: [160, "Meta description should not exceed 160 characters"],
    },
    metaKeywords: {
      type: Array, // store as array of keywords
      default: [],
    }
    
},{ timestamps: true} );


const FormationModel = mongoose.models.Formation || mongoose.model("Formation", formationSchema);

export default FormationModel;