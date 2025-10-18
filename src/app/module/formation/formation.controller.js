import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { createNewFormatService, deleteFormatservice, getAllFormationService, getAllFormationWebsiteService, makeUserInterestedToFormationService, SingleFormationService, updateFormationService } from "./formation.service.js";




//api ending point to create a new format
export const createNewFormat = catchAsync( async (req,res) => {

    const result = await createNewFormatService(req);

    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "New formation created successfully",
        data: result
    })
});

//api ending point to get all formation website
export const getAllFormationWebsite = catchAsync( async (req,res) => {

    const response = await getAllFormationWebsiteService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Successfully got all formation",
        data: response
    });

});

//api ending point to get all formation
export const getAllFormation = catchAsync( async (req,res) => {

    const {page,limit,total,totalPage,allFormat} = await getAllFormationService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Successfully got all formation",
        meta: {page,limit,total,totalPage},
        data: allFormat
    });

});

//api ending point to get details of single formation
export const singleFormationDetails = catchAsync( async (req,res) => {

    const response = await SingleFormationService(req.query);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Formation details retrieved successfully",
        data: response
    })
});

//api ending point 
export const updateFormation = catchAsync( async (req,res) => {

    const response = await updateFormationService(req);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Format updated successfully",
        data: response
    })
});

//api ending point to delete formation
export const deleteFormation = catchAsync( async (req,res) => {

    const response = await deleteFormatservice(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Format deleted successfully",
        data: response
    })
});

//api ending point make an user interested to formation
export const makeUserInterestedToFormation = catchAsync( async (req,res) => {

    const response = await makeUserInterestedToFormationService(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Make an user interested to formation successfully",
        data: response
    })
});

//api ending point to get all interested formation
export const getAllUsersInterestedToFormation = catchAsync( async (req,res) => {

    const response = await getAllFormationService(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Got all interested formation successfully",
        data: response
    })
});