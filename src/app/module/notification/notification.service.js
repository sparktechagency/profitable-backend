import AdminNotificationModel from "./AdminNotification.model.js";
import NotificationModel from "./notification.model.js";
import ApiError from "../../../error/ApiError.js";
import validateFields from "../../../utils/validateFields.js";


//get notification service
export const getNotificationService = async (userdata,query) => {
        const role = userdata.role;
        const notificationId = query.notificationId;

        //check if notification id is available or not      
        validateFields(query,["notificationId"]);

        let notification;

        if(role === "Admin"){
            notification = await AdminNotificationModel.findByIdAndUpdate(notificationId,{isRead: true},{ new: true });
        }
        else{
            notification = await NotificationModel.findByIdAndUpdate(notificationId,{ isRead: true }, { new: true });
        }

        //check if user notification is found or not
        if(!notification){
            throw new ApiError(500,"Notification not found")
        }

        return notification;

}

//get all notification service
export const getAllNotificationService = async (userData) => {
    const { role,userId } = userData;

    let notification;

    if(role === "Admin"){
        notification = await AdminNotificationModel.find({}).sort({ createdAt: -1 });
    }else{
        notification = await NotificationModel.find({toId: userId}).populate({path: "toId",select:"-_id image"}).sort({ createdAt: -1 });
    }

    if(!notification){
        throw new ApiError(500, "Failed to get all notification");
    }

    return notification;
}

export const unreadNotificationCountService =async(userData) => {
    const {userId,role} = userData;

    let notification;

    if(role === "Admin"){
        notification = await AdminNotificationModel.countDocuments({});
    }else{
        notification = await NotificationModel.countDocuments({toId: userId, isRead: false});
    }

    if(!notification){
        throw new ApiError(500, "Failed to get all notification");
    }

    return notification;
}

//mark a notifification is read service
export const updateNotificationReadUnreadService = async (query) => {
    const {role,notificationId} = query;

    validateFields(query,["role","notificationId"]);

    let updatedNotification;

    if(role === "Admin"){
        updatedNotification = await AdminNotificationModel.findByIdAndDelete(notificationId);
    }
    else{
        updatedNotification = await NotificationModel.findByIdAndUpdate(notificationId,{isRead: true},{new: true});
    }

    //check if notification deleted or not
    if(!updatedNotification){
        throw new ApiError(500, "notification not found to update");
    }

    return updatedNotification;
}

//delete notification service
export const deleteNotificationService = async (query) => {

    const {role,notificationId} = query;

    validateFields(query,["role","notificationId"]);

    let deletedNotification;

    if(role === "Admin"){
        deletedNotification = await AdminNotificationModel.findByIdAndDelete(notificationId);
    }
    else{
        deletedNotification = await NotificationModel.findByIdAndDelete(notificationId);
    }

    //check if notification deleted or not
    if(!deletedNotification){
        throw new ApiError(500, "notification not found");
    }

    return deletedNotification;

}