import catchAsync from "../../../utils/catchAsync.js";
import { getAllInterestedBusinessByUserService, getAllInterestedUsersService, makeAnUserInterestedService } from "./interested.service.js";
import sendResponse from "../../../utils/sendResponse.js";
// import { deleteBusinessService } from "../business/business.service.js";



//api ending point to make an user interested
export const  makeAnUserInterested = catchAsync(async (req,res) => {
    const newInterestedUser = await makeAnUserInterestedService(req);

    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Your interest has been submitted to the Lister",
        data: newInterestedUser
    });
});


//get all interested user filter by a single Business
export const getInterestedUsersByBusiness = catchAsync(async (req,res) => {
    const allInterestedUsers = await getAllInterestedUsersService(req.query);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "got all interested user",
        data: allInterestedUsers
    });
});


//get all interested business filter by user
export const getInterestedBusinessByUser = catchAsync(async (req,res) => {
    const response = await getAllInterestedBusinessByUserService(req);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "got all business related to you",
        data: response
    });
});

//get all interested business filter by user
// export const deleteInterestedBusiness = catchAsync(async (req,res) => {

//     const response = await deleteBusinessService(req.query);

//     sendResponse(res,{
//         statusCode: 200,
//         success: true,
//         message: "deleted interesesd business",
//         data: response
//     });
// });
