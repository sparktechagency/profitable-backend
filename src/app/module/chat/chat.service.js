import ApiError from "../../../error/ApiError.js";
import validateFields from "../../../utils/validateFields.js"
import UserModel from "../user/user.model.js";
import ChatModel from "./chat.model.js";
import postNotification from "../../../utils/postNotification.js";
import mongoose from "mongoose";
import MessageModel from "./message.model.js";

//post new chat service
export const postNewChatService = async ( userDetail,payload ) => {
    const { userId } = userDetail;
    const { receiverId } = payload;

    validateFields(payload,["receiverId"]);

    const user = await UserModel.findById(userId).lean();
    if(!user){
        throw new ApiError(404,"User not found");
    }

    const receiver = await UserModel.findById(receiverId).lean();
    if(!receiver){
        throw new ApiError(404, "Receiver not found");
    }

    const existChat = await ChatModel.findOne({ participants: { $all: [userId,receiverId] } } );
    if(existChat){
        return existChat;
    }

    //create new chat
    const newChat = await ChatModel.create({ participants: [userId,receiverId], messages: [] });

    //send notification
    postNotification("New message","You have received a new conversation request", receiverId);

    postNotification("New message","You have started a new conversation", userId);

    return newChat;

}

//get chat messages service
export const getChatMessagesService = async (query) => {
    const { chatId } = query;

    validateFields(query,["chatId"]);

    //get chat messages
    const chats = await ChatModel.findOne({
        _id: chatId
    }).populate([ { path: "participants" , select: "name image mobile" }]).lean();

    if(!chats){
        throw new ApiError(404,"Chat not found");
    }

    return chats;
}

//get all chat message service
export const getAllChatsService = async (userDetail) => {
    const userId = mongoose.Types.ObjectId.createFromHexString(userDetail.userId);
    // const {userId} = userDetail;
    //get all chatlist by a user
    // const chats = await ChatModel.find({participants: { $in: [userId]}}).populate({path:"participants",select:"name image"});
    const chats = await ChatModel.aggregate([
      // 1. Find chats where user is a participant
      {
        $match: {
          participants: { $in: [userId] }
        }
      },

      // 2. Lookup all messages of this chat
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messages"
        }
      },

      // 3. Get last message (sort + slice)
      {
        $addFields: {
          lastMessage: { $arrayElemAt: [{ $slice: ["$messages", -1] }, 0] }
        }
      },

      // 4. Count unread messages for this user
      {
        $addFields: {
          unreadCount: {
            $size: {
              $filter: {
                input: "$messages",
                as: "msg",
                cond: {
                  $and: [
                    { $eq: ["$$msg.receiver", userId] },
                    { $eq: ["$$msg.isRead", false] }
                  ]
                }
              }
            }
          }
        }
      },

      // 5. Populate participants
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants"
        }
      },

      // 6. Remove current user from participants list
      {
        $addFields: {
          participants: {
            $filter: {
              input: "$participants",
              as: "p",
              cond: { $ne: ["$$p._id", userId] }
            }
          }
        }
      },

      // 7. Keep only required fields
      {
        $project: {
          "participants._id": 1,
          "participants.name": 1,
          "participants.image": 1,
          lastMessage: 1,
          unreadCount: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },

      // 8. Sort chats by last message time (like WhatsApp)
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
  ]);




    if(!chats){
      throw new ApiError(404,"Failed to get chat list");
    }
    // console.log(chats);

    return chats;

}

//update message as seen service
export const updateMessageAsSeenService = async (userData,payload) => {
    const { userId } = userData;
    const { chatId } = payload;

    validateFields(payload,["chatId"]);

    const chat = await ChatModel.findById(chatId);
    if(!chat){
        throw new ApiError(404, "Chat not found");
    }

    const result = await MessageModel.updateMany({
        _id: {$in: chat.messages}, receiver: userId, isRead: false
    },{
        $set: { isRead : true }
    });

    return result;
 }