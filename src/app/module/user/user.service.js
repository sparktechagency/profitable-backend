import ApiError from "../../../error/ApiError.js";
import UserModel from "./user.model.js";
import deleteFile from "../../../utils/deleteUnlinkFile.js";

//user details service
export const getUserDetailsService = async (user) => {
    const {userId} = user;
    if(!userId){
        throw new ApiError(400, "UserId is required to get user details");
    }

    const userDetails = await UserModel.findById(userId);
    
    if(!userDetails){
        throw new ApiError(404, "user details not found");
    }

    return userDetails;
}


//user profile update service
export const userProfileUpdateService = async (req) => {
    const userId = req.user.userId;

    let image;
    if(req.file){
         image = req.file.filename;
    }

    const {name, mobile, profession, country, description} = req.body;

    const user = await UserModel.findById(userId).select("name email image");
    // console.log(user);
    
    if(!user) throw new ApiError(404, "User not found to update user");

    
    //need user email id to find out user in db
    const updatedUser = await UserModel.findByIdAndUpdate(userId,{
        image,name, mobile, profession, country, description
    },{new: true}).select('name email');

    if(!updatedUser){
        throw new ApiError(404, "User not found and failed to update profile");
    }
    
    //delete user image before update user
    if(req.file){
        if(user.image){
            deleteFile("profile-image",user.image);
        }
    }
    
    return updatedUser; 

}

//get seller detail
export const sellerDetailService = async (req) => {
    const buyerId = req.user.userId;
    const {userId} = req.query;
    console.log(userId);
    if(!userId || !buyerId){
        throw new ApiError(400, "UserId and buyerId required to get seller details");
    }
    // console.log(userId);
    

    //check buyer's subscription plan
    const buyer = await UserModel.findById(buyerId).select('email subscriptionPlanPrice subscriptionPlan subscriptionPlanType');
    console.log(buyer);
    
    let userDetails;
    if(!buyer) throw new ApiError(404, "User subscription plan not found");

    if(buyer.subscriptionPlan && buyer.subscriptionPlan.subscriptionPlanType === "15 Days"){

        throw new ApiError(400, "Free Plan user cant see Seller's details");
    }
    
    else if(buyer.subscriptionPlan && buyer.subscriptionPlan.subscriptionPlanPrice !== 0){
        console.log("enters");
         userDetails = await UserModel.findById(userId).select("name email image country mobile role").lean();
        // console.log(userDetails);
        
        if(!userDetails){
            throw new ApiError(404, "user details not found");
        }
        console.log(userDetails);
        return userDetails;
    }   


}

