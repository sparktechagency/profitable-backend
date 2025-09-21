import express from "express";
import { getNotification,getAllNotification, deleteNotification, getUnreadNotificationCount, updateAsReadUnread } from "./notification.controller.js";
import { authorizeUser } from "../../middleware/AuthMiddleware.js";



const notificationRouter = express.Router();

notificationRouter.get("/get-single-notification", authorizeUser, getNotification);
notificationRouter.get("/get-all-notification",authorizeUser, getAllNotification);
notificationRouter.get("/get-unread-notification",authorizeUser, getUnreadNotificationCount);
notificationRouter.delete("/delete-notification", deleteNotification);
notificationRouter.patch("/update-notification", updateAsReadUnread);

export default notificationRouter;