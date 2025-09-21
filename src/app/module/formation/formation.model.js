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
    }
    
},{ timestamps: true} );


const FormationModel = mongoose.models.Formation || mongoose.model("Formation", formationSchema);

export default FormationModel;