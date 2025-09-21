import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { createNewFaqService, deleteFaqService, getAllFaqbyUserRoleService, updateFaqService } from "./faq.service.js";



//api ending point to create new faq
export const createNewFaq = catchAsync( async (req,res) => {

    const result = await createNewFaqService(req.body);

    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "created new faq successfully",
        data: result
    });
});

//api ending point to get all faq by user role
export const getAllFaqbyUserRole = catchAsync(async (req,res) => {

    const result = await getAllFaqbyUserRoleService(req.query);

    sendResponse(res,{
        statusCode:200,
        success: true,
        message: "Got all faq filtered by user role",
        data: result
    });

});

//api ending point to update a Faq
export const updateFaq = catchAsync( async (req,res) => {

    const result = await updateFaqService(req);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Faq updation successful",
        data: result
    });

});

//api ending pint to delete a faq
export const deleteFaq = catchAsync( async (req,res) => {

    const result = await deleteFaqService(req.query);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Faq deleted successfully",
        data: result
    })
});