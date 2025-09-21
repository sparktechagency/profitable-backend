import NotificationModel from "../app/module/notification/notification.model.js";;
import AdminNotificationModel from "../app/module/notification/AdminNotification.model.js";
import catchAsync from "./catchAsync.js";
import ApiError from "../error/ApiError.js";


const postNotification = catchAsync( async (title,message,toId) => {

    if(!title || !message){
        throw new ApiError(400,"to post a notification title or message is required");
    }

    //create a new notification
    if(!toId){
        await AdminNotificationModel.create({title,message});
    }
    else{
        await NotificationModel.create({toId,title,message});
    }
});

export default postNotification;