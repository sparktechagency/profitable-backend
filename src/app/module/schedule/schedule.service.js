import ApiError from "../../../error/ApiError.js";
import { sendMakeScheduleEmail } from "../../../utils/emailHelpers.js";
import postNotification from "../../../utils/postNotification.js";
import validateFields from "../../../utils/validateFields.js";
import ScheduleModel from "./schedule.model.js";


//make a meeting schedule service
export const makeAMeetingScheduleService = async (payload) => {
    const {userId, name,email,date,time,timeZone,topic,note} = payload;

    if(!userId){
        throw new ApiError(400,"You have to log in first to make a meeting schedule");
    }

    //validate all the fields are available or not
    validateFields(payload,[
        "name","email","date","time","timeZone","topic"
    ]);

    //now make a new schedule 
    const newSchedule = await ScheduleModel.create({
        user: userId, name,email,date,time,timeZone,topic,note
    });

    if(!newSchedule){
        throw new ApiError(500,"Failed to make a new Schedule");
    }

    //here we need to create a notification 
    //that admin will receive a new notification
    //that one user scheduled a meeting
    // const meetingDate = date.getDate();
    await postNotification("New Meeting Scheduled",`${name} scheduled a meeting at ${time} on ${date}`);
    await postNotification("New Meeting Scheduled",`You scheduled a meeting with PBFS at ${time} on ${date}`,userId);

    //send Email to user
    sendMakeScheduleEmail(email,{name,date,time,timeZone,topic});
    return newSchedule;
}

//retrieve all meeting schedule
export const retrieveAllMeetingScheduleService = async () => {

    const allSchedule = await ScheduleModel.find({});

    if(!allSchedule){
        throw new ApiError(404,"Failed to retrieve all meeting schedule");
    }

    return allSchedule;
}