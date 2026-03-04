import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { adminChangePasswordService, adminLoginService, adminResetPasswordService, adminSendOtpService, adminVerifyOtpService, blockUnblockAdminService, createAdminService, deleteAdminService, editAdminDetailService, getAdminByIdService, getAdminDetailsService, getAllAdminService, updateAdminService } from "./admin.service.js";



export const createNewAdmin = catchAsync(async (req, res) => {

    const response = await createAdminService(req.body);

    //send response
    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Admin created successfully.",
        data: response
    });
});

export const editAdmin = catchAsync(async (req, res) => {
    const response = await updateAdminService(req.params.id,req.body);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin updated successfully.",
        data: response
    });
});

export const adminLogin = catchAsync(async (req, res) => {

    const response = await adminLoginService(req.body);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin login successful.",
        data: response
    });
});

export const getAllAdmin = catchAsync(async (req, res) => {
    const response = await getAllAdminService();

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admins retrieved successfully.",
        data: response
    });
});

export const getSingleAdmin = catchAsync(async (req, res) => {

    const response = await getAdminByIdService(req.params.id);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin retrieved successfully.",
        data: response
    });
});

export const adminSentOtp = catchAsync(async (req, res) => {

    const response = await adminSendOtpService(req.body);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Otp sent successfully. Check your email.",
        data: response
    });
});

export const adminVerifyOtp = catchAsync(async (req, res) => {
    const response = await adminVerifyOtpService(req.body);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Otp verified successfully.",
        data: response
    });
});

export const adminResetPassword = catchAsync(async (req, res) => {

    const response = await adminResetPasswordService(req.body);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Password reset successfully.",
        data: response
    });
});

export const blockAdmin = catchAsync(async (req, res) => {

    const response = await blockUnblockAdminService(req.params.id);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: response.message,
        data: response
    });
});

export const deleteAdmin = catchAsync(async (req, res) => {

    const response = await deleteAdminService(req.params.id);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin deleted successfully.",
        data: response
    });
});

export const getAdminDetails = catchAsync(async (req, res) => {

    const response = await getAdminDetailsService(req.user);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin details retrieved successfully.",
        data: response
    });
});

export const editAdminDetails = catchAsync(async (req, res) => {

    const response = await editAdminDetailService(req);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin details updated successfully.",
        data: response
    });
});

export const adminChangePassword = catchAsync(async (req, res) => {

    const response = await adminChangePasswordService(req.body, req.user);

    //send response
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin password changed successfully.",
        data: response
    });
});