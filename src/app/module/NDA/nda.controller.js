import ApiError from "../../../error/ApiError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import NDAModel from "./nda.model.js";




//api ending point to create nda data
export const createNda = catchAsync(

    async (req,res) => {
        const {} = req.body;

        const response = await NDAModel.create({
            
        });
        if(!response) throw new ApiError(404, "Not found NDA");

        sendResponse(res,{
            statusCode: 201,
            success: true,
            message: "Got NDA data",
            data: response
        })
    }
);
//api ending point to retrieve nda data
export const getNdaFilteredByUserRole = catchAsync(

    async (req,res) => {

        const { role } = req.query;
        if(!role) throw new ApiError(400, "Role is required to filter nda");

        const response = await NDAModel.findOne( {role: role} );
        if(!response) throw new ApiError(404, "Not found NDA");

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Got NDA data",
            data: response
        })
    }
);


