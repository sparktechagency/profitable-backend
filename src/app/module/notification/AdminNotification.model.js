import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true,"Notification title is required to create a new notification"],
    },
    message: {
      type: String,
      required: [true,"Notification message is required to create a new notification"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AdminNotificationModel = mongoose.models.AdminNotification || mongoose.model("AdminNotification", adminNotificationSchema);

export default AdminNotificationModel;
