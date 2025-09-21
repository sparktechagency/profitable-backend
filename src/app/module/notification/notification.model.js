import mongoose from "mongoose";
// const ObjectId = Schema.Types.ObjectId;

const notificationSchema = new mongoose.Schema(
  {
    toId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  }, {  timestamps: true,}

);

const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default NotificationModel;


/*I am using Node js version 22 with express. Already completed authorization part, user creation, add new business, then update business portion, user subscription etc. now working on chat messaging and notification.
*/
