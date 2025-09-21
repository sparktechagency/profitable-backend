import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
// import UserModel from "../user/user.model.js";
import {  forgetPasswordOtpVerifyService, forgetPasswordService, resetPasswordService, userLoginService, userRegistrationProcess, verifyEmailSendOtpService, verifyEmailVerifyOtpService } from "./auth.service.js";



//api end point for reistering user
export const registerUser = catchAsync(async (req,res) => {

    const result = await userRegistrationProcess(req.body);
    console.log(result);
    

    const isSuccess = (result.message === "Account created successfully. Verify your email" ? true : false);

    sendResponse(res, {
        statusCode: isSuccess ? 201 : 400,
        success: isSuccess,
        message: result.message || "Something went wrong to register user",
        data: result
    });

    
});


//api end point to login user
export const loginUser = catchAsync(async (req, res) => {
     const result = await userLoginService(req.body);

     //cookie related job
    // const { refreshToken } = result;

    // const cookieOptions = {
    //     secure: config.env === "production",
    //     httpOnly: true,
    // };

    // res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Log in successful",
        data: result,
    });
});

//api ending point to verify email
export const verifyEmailSendOtp = catchAsync(async (req, res) => {
    const response = await verifyEmailSendOtpService(req.body);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Check your email",
        data: response
    });
});

//api ending point to verify email otp
export const verifyEmailVerifyOtp = catchAsync( async (req,res) => {
    const result =  await verifyEmailVerifyOtpService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Email verified successfully",
        data: result
    });
});

//api ending point for forgetPassword
export const forgetPassword = catchAsync(async (req,res) => {
    await forgetPasswordService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Check your email"
    });
});

//api ending point for forget password verify otp
export const forgetPasswordVerifyOtp = catchAsync( async (req,res) => {
    const result = await forgetPasswordOtpVerifyService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "forget password otp verified successfully",
        data: result
    });
});

//api ending point for reset password
export const resetPassword = catchAsync( async (req,res) => {
    await resetPasswordService(req.body);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Password has been reset successfully.",
    });
});

//api ending point to select role
// export const selectUsersRole = catchAsync(async (req,res) => {

//     await selectUsersRoleService(req.body);

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: " User role added successfully"
//     });
// });

