import validateFields from "../../../utils/validateFields.js";
import FormationModel from "./formation.model.js";
import FormationInterestedModel from "./formationInterested.model.js";
import ApiError from "../../../error/ApiError.js";
import deleteFile from "../../../utils/deleteUnlinkFile.js";



//create new formation service
export const createNewFormatService = async (req) => {
    let imgName;
    if(req.file){
        imgName = req.file.filename;
    }
    const { title, detail } = req.body;

    //check if all necessery fields are availablr or not
    validateFields(req.body,["title","detail"]);

    //create new format
    const newFormat = await FormationModel.create({image: imgName, title, detail});

    if(!newFormat){
        throw new ApiError(500,"Failed to create new formation");
    }

    return newFormat;

}



//get all formation service
export const getAllFormationService = async (query) => {
    let {page} = query;

    page = parseInt(page) || 1;
    // default limit = 10
    let limit = 4;
    let skip = (page - 1) * limit;

    //get all info from db
    const allFormat = await FormationModel.find({}).skip(skip).limit(limit);

    if(!allFormat){
        throw new ApiError(404, "Failed to get all formation");
    }

    let total = await FormationModel.countDocuments();
    let totalPage = Math.ceil(total / limit);

    return {page,limit,total,totalPage,allFormat};
}

//get a single formation service
export const SingleFormationService = async (query) => {
    const { formationId } = query;
    if(!formationId){
        throw new ApiError(400, "Formation Id is required to update a format");
    }

    //get formation
    const formation = await FormationModel.findById(formationId);

    if(!formation){
        throw new ApiError(404, "Failed to retrieve formation details");
    }

    //now update format
    
    return formation;
}

//update formation service
export const updateFormationService = async (req) => {
    console.log(req.body, req.file, req.query);
    const { formatId } = req.query;
    if(!formatId){
        throw new ApiError(400, "Formation Id is required to update a format");
    }

    let imgName;
    if(req.file){
        imgName = req.file.filename
    }

    const { title, detail } = req.body;

    const format = await FormationModel.findById(formatId);

    //get formation
    const updatedFormation = await FormationModel.findByIdAndUpdate(formatId,{image: imgName,title,detail},{new: true});

    if(!updatedFormation){
        throw new ApiError(404, "Failed to retrieve formation for update");
    }

    //delete old img
    if(req.file){
        deleteFile("formation-image",format.image);
    }
    //now update format
    return updatedFormation;
}

//delete formation service
export const deleteFormatservice = async (query) => {

    const {  formatId } = query;

    //check if id is availavle or not
    if(!formatId){
        throw new ApiError(400,"Formation id is required to delete formation");
    }
    const format = await FormationModel.findById(formatId);
    const deletedFormat = await FormationModel.findByIdAndDelete(formatId);

    //check if deleteted or not
    if(!deletedFormat){
        throw new ApiError(500, "Failed to delete formation");
    }

    //delete old img
    deleteFile("formation-image",format.image);
    

    return deletedFormat;

}

//make user interested formation service
export const makeUserInterestedToFormationService = async (payload) => {
    // const userRole = req.user.role;
    const {formationId,userId,name,countryCode,mobile,sector,activity,email,serviceZone,message} = payload;

    //check if all the fields are available
    validateFields(payload,["formationId","userId","name","email"]);

    const newInterestedUser = await FormationInterestedModel.create({
        formationId,userId,name,countryCode,mobile,sector,activity,email,serviceZone,message
    });

    if(!newInterestedUser){
        throw new ApiError(500,"Failed to create new user interested to a Business");
    }

    return newInterestedUser
}

//make user interested formation service
export const getAllInterestedFormationService = async (query) => {
    // const { formationId } = query;

    const formation = await FormationInterestedModel.find({});

    if(!formation) throw new ApiError(500,"Formation not found");

    return formation;
}