import mongoose from "mongoose";


const ndaSchema =  new mongoose.Schema({
    purpose:{
        type: String
    },
    definitionOfConfidentialInformation:{
        type: String
    },
    obligation:{
        type: String
    },
    exception:{
        type: String
    },
    guaranteeSale:{
        type: String
    },
    
    dataComplience:{
        type: String
    },
    durationAndEnforcement:{
        type: String
    },
    governingLaw:{
        type: String
    },
    entireAgreement:{
        type: String
    },
    acknowledgement:{
        type: String
    },
    role:{
        type: String
    }
});


const NDAModel = mongoose.models.NDA || mongoose.model("NDA",ndaSchema);

export default NDAModel;