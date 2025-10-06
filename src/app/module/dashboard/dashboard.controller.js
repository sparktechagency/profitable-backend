import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import UserModel from "../user/user.model.js";
import BusinessModel from "../business/business.model.js";
import CategoryModel from "../category/category.model.js";
import ApiError from "../../../error/ApiError.js";
import mongoose from "mongoose";
import validateFields from "../../../utils/validateFields.js";
import postNotification from "../../../utils/postNotification.js";
import { sendListingConfirmationEmail, sendRejectionEmail,newBusinessListingEmail } from "../../../utils/emailHelpers.js";

//utility function 
// to send email to all buyer and investor when a new business listed
const sendNotificationToAllBuyerAndInvestor = async (title,country,businessType,role) => {
    // console.log("Sending email to all buyer and investor");
    //find out all buyer and investor who has subscription plan
    if(role === "Business Idea Lister"){
        const users = await UserModel.find({role: Investor,subscriptionPlanPrice: { $gt: 0 }}).select("name email").lean();
    
        //now send notification to all buyer and investor
        if(users.length > 0){
            for (const user of users) {
                postNotification(
                    "Latest listed Idea",
                    `Business Idea: ${title}, location: ${country},`,
                    user._id
                );
                await newBusinessListingEmail(user.email, {
                    name: user.name,
                    title,
                    country,
                    businessType
                });
            }

        }
    }
    else {

        const users = await UserModel.find({role: { $in: ["Buyer","Investor"]},subscriptionPlanPrice: { $gt: 0 }}).select("name email").lean();
    
        //now send notification to all buyer and investor
        if(users.length > 0){
            for (const user of users ) {
                postNotification(
                    "Latest listed Business",
                    `Business : ${title}, location: ${country},`,
                    user._id
                );
                await newBusinessListingEmail(user.email, {
                    name: user.name,
                    title,
                    country,
                    businessType
                });
            }

        }
    }
}

//api ending point to get data for dashboard
export const dashboardController = catchAsync( async (req,res) => {
   
    const [totalUser,totalBusiness,totalCategory] = await Promise.all([
        UserModel.countDocuments(),BusinessModel.countDocuments({isApproved: true}),CategoryModel.countDocuments()
    ]); 

    const year = req.query.year; // pass dynamic year from query or params

    const result = await BusinessModel.aggregate([
        {
            $match: {
                isApproved: true,
                createdAt: {
                    $gte: new Date(`${year}-01-01`),   // first day of year
                    $lt: new Date(`${year + 1}-01-01`) // first day of next year
                }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },   // group by month number
                totalBusinesses: { $sum: 1 },
                //businesses: { $push: "$$ROOT" }  // optional: keep full docs for each month
            }
        },
        {
            $project: {
                month: "$_id",
                totalBusinesses: 1,
                // businesses: 1,
                _id: 0
            }
        },
        { $sort: { month: 1 } }  // sort by month ascending (Jan → Dec)
    ]);




    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "dashboard data got retrieved",
        data: {totalUser,totalBusiness,totalCategory,result}
    });
});

//api ending point to get all user
export const getAllUsers = catchAsync( async (req,res) => {

    // Get page & limit from query params
    let { page,searchText } = req.query;

        if(searchText){
            
            //$regex: searchTerm → Matches titles that contain the given term.
            //$options: "i" → Makes it case-insensitive (so "Coffee" matches "coffee").
            const response = await UserModel.aggregate([
            // 1️⃣ Search by name (case-insensitive)
                {
                    $match: { name: { $regex: searchText, $options: "i" } }
                },

                // 2️⃣ Lookup subscription plan
                {
                    $lookup: {
                    from: "subscriptionplans", // collection name in MongoDB
                    localField: "subscriptionPlan",
                    foreignField: "_id",
                    as: "subscriptionPlan"
                    }
                },

                // 3️⃣ Extract only one subscriptionPlan (not array)
                { $unwind: { path: "$subscriptionPlan", preserveNullAndEmptyArrays: true } },

                // 4️⃣ Project only required fields
                {
                    $project: {
                    name: 1,
                    email: 1,
                    mobile: 1,
                    country: 1,
                    role: 1,
                    isBlocked: 1,
                    "subscriptionPlan.subscriptionPlanType": 1
                    }
                },

                // 5️⃣ Sort by createdAt (newest first)
                { $sort: { createdAt: -1 } },

                // 6️⃣ Pagination
                // { $skip: skip },
                // { $limit: limit }
            ]);


            sendResponse(res,{
                statusCode: 200,
                success: true,
                message: "Got all user",
                data: response
            });

            // return;

        }

    page = parseInt(page) || 1;    // default page = 1
    let limit = 10; // default limit = 10

    const skip = (page - 1) * limit;
   
    const users = await UserModel.find({}).populate({
        path: "subscriptionPlan", select: "subscriptionPlanType"
    }).select('name email mobile country role isBlocked').sort({createdAt: -1}).skip(skip).limit(limit);

    if(!users) throw new ApiError(500, "No user found. Server Error");
    
    const total = await UserModel.countDocuments();
    const totalPage = Math.ceil(total / limit);
    

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Got all user",
        meta:{page,limit: 10,total, totalPage},
        data: users
    });
});

//api ending point to block user
export const blockUserController = catchAsync( async (req,res) => {
   
    const {userId} = req.query;
    
    if(!userId) throw new ApiError(400, "User Id is required to block a User");

    const user = await UserModel.findById(userId).select('name email isBlocked');

    let msg = (user.isBlocked === true ? "User is UnBlocked" : "User is Blocked");

    //toggole isBlock
    user.isBlocked = !user.isBlocked;
    await user.save();

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: msg,
        data: user
    });
});

//api ending point to get user's total listed business
export const getUsersTotalBusiness = catchAsync( async (req,res) => {
   
    const {userId} = req.query;

    if(!userId) throw new ApiError(400, "User id is required to get user's total listed business");

    // const result = await BusinessModel.aggregate([
    //   {
    //     $match: { 
    //         user: new mongoose.Types.ObjectId(userId),
    //     } 
    //   },
    //   {
    //     $facet: {
    //       totalListed: [{ $count: "count" }],
    //       totalSold: [
    //         { $match: { isSold: true } }, // assuming you have a "status" field
    //         { $count: "count" }
    //       ],
    //       totalApproved: [
    //         { $match: { isApproved: true } },
    //         { $count: "count" }
    //       ],
    //       businessTitles: [
    //         { $project: { title: 1, _id: 0 } }
    //       ],
    //       businessCategories: [
    //         { $project: { category: 1, _id: 0 } }
    //       ],
    //       businessCountries: [
    //         { $project: { country: 1, _id: 0 } }
    //       ]
    //     }
    //   },
    //   {
    //     $project: {
    //       totalListed: { $ifNull: [{ $arrayElemAt: ["$totalListed.count", 0] }, 0] },
    //       totalSold: { $ifNull: [{ $arrayElemAt: ["$totalSold.count", 0] }, 0] },
    //       totalApproved: { $ifNull: [{ $arrayElemAt: ["$totalApproved.count", 0] }, 0] },
    //       businessTitles: "$businessTitles.title",
    //       businessCategories: "$businessCategories.category",
    //       businessCountries: "$businessCountries.country"
    //     }
    //   }
    // ]);
    const result = await BusinessModel.aggregate([
        {
            $match: {
            user: new mongoose.Types.ObjectId(userId) // filter by owner
            }
        },
        {
            $facet: {
                // 1️⃣ Total businesses listed by user
                totalListed: [{ $count: "count" }],

                // 2️⃣ Total sold businesses
                totalSold: [
                    { $match: { isSold: true } },
                    { $count: "count" }
                ],

                // 4️⃣ Total approved businesses
                totalApproved: [
                    { $match: { isApproved: true } },
                    { $count: "count" }
                ],

                // 5️⃣ Total not approved businesses
                totalNotApproved: [
                    { $match: { isApproved: false } },
                    { $count: "count" }
                ],

                // 6️⃣ Approved businesses with user details
                approvedBusinesses: [
                    { $match: { isApproved: true } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "userData"
                        }
                    },
                    { $unwind: "$userData" },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            category: 1,
                            subCategory: 1,
                            country: 1,
                            askingPrice: 1,
                            ownerShipType: 1,
                            createdAt: 1,
                            "userData._id": 1,
                            "userData.name": 1,
                            "userData.email": 1,
                            "userData.image": 1,
                            "userData.role": 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                totalListed: { $ifNull: [{ $arrayElemAt: ["$totalListed.count", 0] }, 0] },
                totalSold: { $ifNull: [{ $arrayElemAt: ["$totalSold.count", 0] }, 0] },
                totalApproved: { $ifNull: [{ $arrayElemAt: ["$totalApproved.count", 0] }, 0] },
                totalNotApproved: { $ifNull: [{ $arrayElemAt: ["$totalNotApproved.count", 0] }, 0] },
                approvedBusinesses: 1
            }
        }
    ]);

    const totalListed = result[0].totalListed;
    const totalApproved = result[0].totalApproved;
    const totalSold = result[0].totalSold
    const rejectedListing = result[0].totalNotApproved;
    const approvedBusiness = result[0].approvedBusinesses;
    // console.log(result);
    // console.log(result[0].totalListed,);
    
    // return {totalListed,totalApproved,totalSold,rejectedListing};
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Got userr's total listed business with statistics",
        data: {totalListed,totalApproved,totalSold,rejectedListing,approvedBusiness}
    });
});

//api ending point to get user's total listed business
export const allListedBusiness = catchAsync( async (req,res) => {
    let { businessRole, page } = req.query;
    // Get page & limit from query params

    page = parseInt(page) || 1;    // default page = 1
    let limit = 10; // default limit = 10

    const skip = (page - 1) * limit;

    let filter = {};

    switch (businessRole) {
        case "not-approved":
            filter = { isApproved: false };
            break;
        case "Seller":
            filter = { businessRole: "Seller", isApproved: true };
            break;
        case "Asset Seller":
            filter = { businessRole: "Asset Seller", isApproved: true };
            break;
        case "Francise Seller":
            filter = { businessRole: "Francise Seller", isApproved: true };
            break;
        case "Business Idea Lister":
            filter = { businessRole: "Business Idea Lister", isApproved: true };
            break;
        default:
            filter = {}; // optional fallback
    }

    const business = await BusinessModel.find(filter).populate({path: "user", select:"name email image"}).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await BusinessModel.countDocuments();
    const totalPage = Math.ceil(total / limit);
   
    sendResponse(res,{
        statusCode: 200,
        success: true,
        meta:{page,limit: 10,total, totalPage},
        message: "Got all listed business",
        data: business
    });
});

//api ending point to get user's total listed business
export const approveBusinessController = catchAsync( async (req,res) => {
   
    const {businessId} = req.query;
    if(!businessId) throw new ApiError(400,"Business id is required to make a business approved");

    const business = await BusinessModel.findById(businessId).populate({path: "user", select:"name email"});
    if(!business)throw new ApiError(404,"Business not found to approved");
    // console.log(business);

    let msg
    if(business.isApproved === true){
        msg = "Rejected this business";
    } else{
        msg = "Approved this business"
    }
      
    business.isApproved = !business.isApproved;
    await business.save();

    //send notification to user that his business got approval
    if(business.isApproved === true){
        postNotification("Your business got Approval","Admin approved your business and it is open to all buyers and investors",business.user);
        //send email to user
        await sendListingConfirmationEmail(business.user.email,{name: business.user.name,title: business.title, location: business.countryName,Date: business.createdAt});

        //send email to all buyer and investor
        await sendNotificationToAllBuyerAndInvestor(business.title,business.countryName,business.businessType,business.businessRole);
    }else{
        postNotification("Your business is Rejected","Admin rejected your business. Contact with Admin to get support",business.user);

        //send email to user
        await sendRejectionEmail(business.user.email,{name: business.user.name,title: business.title, location: business.countryName,Date: business.createdAt});

    }
    // return {totalListed,totalApproved,totalSold,rejectedListing};
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: msg,
        data: business
    });
});

//api ending point to change password
export const changePasswodController = catchAsync( async (req,res) => {
   
    const {email,currentPassword,newPassword,confirmPassword} = req.body;

    validateFields(req.body,["email","currentPassword","newPassword","confirmPassword"]);

    const admin = await UserModel.findOne({email: email, role: "Admin"});

    if(!admin) throw new ApiError(404, "No Admin found on this email id");

    if(admin.password !== currentPassword){
        throw new ApiError(400,"You current password has not matched with admin password");
    }

    if(newPassword !== confirmPassword){
        throw new ApiError(400,"New password and confirm password not matched. Please check");
    }
    
    admin.password = newPassword;
    await admin.save();

    
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin password changed successfully",

    });
});

