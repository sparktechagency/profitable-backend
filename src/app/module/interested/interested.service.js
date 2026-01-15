import ApiError from "../../../error/ApiError.js";
import { sendBuyersEnquiryEmail, sendInvestorEnquiryEmailToIdeaLister } from "../../../utils/emailHelpers.js";
import validateFields from "../../../utils/validateFields.js";
import BusinessModel from "../business/business.model.js";
import InterestedModel from "./interested.model.js";
import postNotification from "../../../utils/postNotification.js";



//make an user interested to a particular service
export const makeAnUserInterestedService = async (req) => {
    const role = req.user.role;
    
    const {businessId,userId,name,mobile,sector,activity,email,serviceZone,message,businessRole} = req.body;
    // console.log(req.body);

    //check if all the fields are available
    validateFields(req.body,["businessId","name","email","mobile","businessRole"]);

    const business = await BusinessModel.findById(businessId).select("title businessRole slug").lean();

    //Broker and Buyer can not show interest on business ideas
    if((role === "Buyer" && business.businessRole === "Business Idea Lister") || (role === "Broker" && business.businessRole === "Business Idea Lister")){
        throw new ApiError(400,"Only an investor can show interest on Business Ideas");
    }

    //check if this business is already buyer's interested list or not
    const interestedBusiness = await InterestedModel.findOne({businessId, userId});
    if(interestedBusiness){
        
        throw new ApiError(400,"You already added this business in your interested list");
    } 

    const newInterestedUser = await InterestedModel.create({
        businessId,userId: req.user.userId,businessRole,userRole: role,name,mobile,sector,activity,email,serviceZone,message
    });

    if(!newInterestedUser){
        throw new ApiError(500,"Failed to create new user interested to this Business");
    }

    const seller = await BusinessModel.findById(businessId).populate({path: "user", select:"name email role subscriptionPlan subscriptionPlanPrice"}).select("title businessRole");

    //send separate email to idea lister
    if(role === "Investor" && seller.businessRole === "Business Idea Lister"){
        //send notification to idea lister
        postNotification("New Enquiry",`You have a new enquiry from ${name} about your listed business ideas. View and respond to keep the deal moving.`,seller.user._id);

        //get investor subscription plan details

        //send email to idea lister
        const emailData = {
            sellerName: seller.user.name,
            businessTitle: seller.title,
            buyerName: name,
            buyerEmail: email,
            buyerPhone: mobile
        }
        await sendInvestorEnquiryEmailToIdeaLister(seller.user.email,emailData);

        return newInterestedUser;
    }

    //send notification to seller
    postNotification("New Enquiry",`You have a new inquiry from ${name} about your listed business. View and respond to keep the deal moving.`,seller.user._id);

    //send email to Seller that his business got new interested buyer
    // if(seller.user.role !== "Business Idea Lister"){}
    if(seller.user.subscriptionPlan && seller.user.subscriptionPlanPrice > 0){
        const emailData = {
            sellerName: seller.user.name,
            businessTitle: seller.title,
            buyerName: name,
            buyerEmail: email,
            buyerPhone: mobile
        }
        await sendBuyersEnquiryEmail(seller.user.email,emailData);
        console.log("Email sent for buyer enquery");
    }else if(seller.user.subscriptionPlan && seller.user.subscriptionPlanPrice === 0){

        await sendBuyersEnquiryEmail(seller.user.email,{sellerName: seller.user.name,businessTitle: null});
        console.log("Email sent for buyer enquery");
    }

    return newInterestedUser;
}

//get all interested users filtered by business
export const getAllInterestedUsersService = async (query) => {
    const { businessId } = query;

    if(!businessId){
        throw new ApiError(400, "businessId  is required to filter interested user");
    }
    //get seller details, check subscription plan if no subscription plan
    const business = await BusinessModel.findById(businessId).populate({path: "user", select:"subscriptionPlan subscriptionPlanPrice"}).select("title").lean();

    //then seller won't see any interested buyer list
    if(business.user.subscriptionPlan && business.user.subscriptionPlanPrice === 0){

        throw new ApiError(403,"To see all interested buyer's detail you have to buy a subscription plan");
    }


    const interestedUsers = await InterestedModel.find({businessId: businessId});
    
    if(!interestedUsers){
        throw new ApiError(500, "failed to get all interested user");
    }

    return interestedUsers;
}


//get all interested Business filtered by user
export const getAllInterestedBusinessByUserService = async (req) => {
    const { userId,role } = req.user;

    if(!userId || !role){
        throw new ApiError(400, "userId and role  is required to get interested business/added business");
    }

    //now check user role and perform query
    if(role === "Buyer"){

        const [interestedBusiness,interestedBusinessAsset,interestedFranchise] = await Promise.all([

            InterestedModel.find({userId: userId, businessRole: { $in: ["Seller", "Broker"] } }).populate({ path: "businessId"}),
            InterestedModel.find({userId: userId, businessRole: "Asset Seller" }).populate({ path: "businessId"}),
            InterestedModel.find({userId: userId, businessRole: "Francise Seller" }).populate({ path: "businessId"}),
            // InterestedModel.find({userId: userId, businessRole: "Business Idea Lister" }).populate({ path: "businessId"})
        ]);

        return {interestedBusiness,interestedBusinessAsset,interestedFranchise};
        
    }
    else if( role === "Investor"){

        const [interestedBusiness,interestedBusinessAsset,interestedFranchise,interestedBusinessIdeas] = await Promise.all([

            InterestedModel.find({userId: userId, businessRole: { $in: ["Seller", "Broker"] } }).populate({ path: "businessId"}),
            InterestedModel.find({userId: userId, businessRole: "Asset Seller" }).populate({ path: "businessId"}),
            InterestedModel.find({userId: userId, businessRole: "Francise Seller" }).populate({ path: "businessId"}),
            InterestedModel.find({userId: userId, businessRole: "Business Idea Lister" }).populate({ path: "businessId"})
        ]);

        return {interestedBusiness,interestedBusinessAsset,interestedFranchise,interestedBusinessIdeas};
        
    }

    else if(role === "Seller" || role === "Francise Seller" || role === "Business Idea Lister" || role === "Asset Seller"){

        const [myBusiness,mySoldBusiness] = await Promise.all([

            BusinessModel.find({user: userId, isSold: false}), BusinessModel.find({user: userId, isSold: true})
        ]);

        return {myBusiness,mySoldBusiness};
    }   

    else if(role === "Broker"){

        const [myBusiness,mySoldBusiness,interestedBusiness,interestedBusinessAsset,interestedFranchise] = await Promise.all([

            BusinessModel.find({user: userId, isSold: false}),
            BusinessModel.find({user: userId, isSold: true}),
            InterestedModel.find({userId: userId, businessRole: { $in: ["Seller", "Broker"] } }).populate({ path: "businessId"}),
            InterestedModel.find({userId: userId, businessRole: "Asset Seller" }).populate({ path: "businessId"}),
            InterestedModel.find({userId: userId, businessRole: "Francise Seller" }).populate({ path: "businessId"}),
        ]);

        return {myBusiness,mySoldBusiness,interestedBusiness,interestedBusinessAsset,interestedFranchise};
    }   

}

//delete interested business service
// export const deleteInterestedBusinessService = async (query) => {

// }