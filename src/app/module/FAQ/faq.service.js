import ApiError from "../../../error/ApiError.js";
import validateFields from "../../../utils/validateFields.js"
import FaqModel from "./faq.model.js";



//create new faq service
export const createNewFaqService = async (payload) => {
    const {question, answer, role } = payload;

    //check if all necessery data is coming or not
    validateFields(payload,["question","answer","role"]);

    //create new faq
    const newFaq = await FaqModel.create({question,answer,role});
    if(!newFaq){
        throw new ApiError(500,"Failed to create new faq");
    }

    return newFaq;
}

//get all faq filtered bu user role
export const getAllFaqbyUserRoleService = async (query) => {
    const { role } = query;

    //check if role field is available
    if(!role){
        throw new ApiError(400, "user role is required to filter faq");
    }

    //filter faq by user role from faq collection
    const allFaq = await FaqModel.find({role: role});

    if(!allFaq){
        throw new ApiError(404,"Failed to filter faq by user role");
    }

    return allFaq;
}

//update a faq service
export const updateFaqService = async (req) => {
    const  {faqId } = req.query;
    if(!faqId){
        throw new ApiError(400, "Faq id is required to update a faq");
    }

    const { question, answer } = req.body;

    //check if faqId is available or not
    validateFields(req.body,["question","answer"]);

    //update a faq
    const updatedFaq = await FaqModel.findByIdAndUpdate(faqId,{
        $set:{
            question: question, answer: answer
        }
    },{new: true});

    //check if faq is updated or not
    if(!updatedFaq){
        throw new ApiError(404,"Failed to update faq");
    }

    return updatedFaq;
}

//delete a faq
export const deleteFaqService = async (query) => {
    const { faqId } = query;

    //if needed convert faqId to mongoose Object id type
    //using createHexString() static method
    if(!faqId){
        throw new ApiError(400, "Faq Id is required to delete a faq");
    }

    //find faq by id and then delete
    const deletedFaq = await FaqModel.findByIdAndDelete(faqId);

    //check if it;s deleted or not
    if(!deletedFaq){
        throw new ApiError(404,"not found Faq and deletion failed");
    }

    return deletedFaq;

}