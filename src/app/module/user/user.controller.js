import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import {  getUserDetailsService, sellerDetailService, userProfileUpdateService } from "./user.service.js";


//api ending point to update user
export const getUserDetails = catchAsync( async (req,res) => {
   
    const response = await getUserDetailsService(req.user);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "User details got successfully",
        data: response
    });
});

//api ending point to update user
export const updateUserProfile = catchAsync( async (req,res) => {
   
    const updatedUser = await userProfileUpdateService(req);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: updatedUser
    });
});

//api ending point to update user
export const getSellerDetail = catchAsync( async (req,res) => {
   
    const response = await sellerDetailService(req);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Got seller detail",
        data: response
    });
});





