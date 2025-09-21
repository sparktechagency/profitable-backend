import catchAsync from "../../../utils/catchAsync.js";
import { makeAMeetingScheduleService, retrieveAllMeetingScheduleService } from "./schedule.service.js";
import sendResponse from "../../../utils/sendResponse.js";


//api ending point to make a meeting schedule
export const makeAMeetingSchedule = catchAsync ( async (req,res) => {

    const newSchedule = await makeAMeetingScheduleService(req.body);

    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Scheduled a meeting successfully",
        data: newSchedule
    });
});

//api ending point to retrieve all meeting schedule
export const retrieveAllMeetingSchedule = catchAsync ( async (req,res) => {

    const response = await retrieveAllMeetingScheduleService();

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Retrieved all meeting schedule successfully",
        data: response
    });
});