import ApiError from "../../../error/ApiError.js";
import UserModel from "./user.model.js";
import deleteFile from "../../../utils/deleteUnlinkFile.js";
import { sendSellerBusinessViewEmail } from "../../../utils/emailHelpers.js";

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
    const {userId, businessName} = req.query;
    // console.log(userId);
    if(!userId || !buyerId){
        throw new ApiError(400, "UserId and buyerId required to get seller details.");
    }
    // console.log(userId);
    

    //check buyer's subscription plan
    const buyer = await UserModel.findById(buyerId).select('name email mobile subscriptionPlan subscriptionPlanType subscriptionPlanPrice');
    console.log(buyer);
    
    let userDetails;
    if(!buyer) throw new ApiError(404, "User subscription plan not found");

    if(buyer.subscriptionPlan && buyer.subscriptionPlanType === "15 Days"){

        throw new ApiError(400, "Free Plan user cant see Seller's details. Please upgrade your subscription plan to view seller details.");
    }
    
    else if(buyer.subscriptionPlan && buyer.subscriptionPlanPrice > 0){
        // console.log("enters");
         userDetails = await UserModel.findById(userId).select("name email image country mobile role subscriptionPlanPrice buyerViewCount");
        // console.log(userDetails);

        //count seller details view by buyer and save in db
        userDetails.buyerViewCount = userDetails.buyerViewCount + 1;
        await userDetails.save();
        
        if(!userDetails){
            throw new ApiError(404, "user details not found");
        }
        // console.log(userDetails);

        //send email to seller when buyer views seller details
        await sendSellerBusinessViewEmail(userDetails.email, {
            name: userDetails.name,
            businessName: businessName,
            buyerName: buyer.name,
            buyerEmail: buyer.email,
            buyerMobile: buyer.mobile,
            sellerSubscriptionPlanPrice: userDetails.subscriptionPlanPrice
        });

        return userDetails;
    }   


}

