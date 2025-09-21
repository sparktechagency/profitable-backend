import UserModel from "../app/module/user/user.model.js";
import ChatModel from "../app/module/chat/chat.model.js";
import MessageModel from "../app/module/chat/message.model.js";
import postNotification from "../utils/postNotification.js";
import ApiError from "../error/ApiError.js";
import { emitError } from "./emitError.js";
import { emitResult } from "./emitResult.js";
import socketCatchAsync from "../utils/socketCatchAsync.js";
import validateSocketFields from "../utils/validateSocketFields.js";
import mongoose from "mongoose";
import { sendNewMessageEmail } from "../utils/emailHelpers.js";

//utility function
// Add this utility if not already present (you have a similar one, but ensuring it's reusable)
const refreshChatListForUser = async (io, userId) => {
  // Simulate the payload for getChatList
  console.log('refresh chat list');
  await getChatList(null, io, { userId: userId.toString() }); // Null socket since we don't need it for emits
};
//update message as seen true
const updateMessageAsSeenTrue = async (userId,chatId) => {
  
    // console.log(userId,chatId);
    const updatedChat = await ChatModel.findById(chatId);
    if(!updatedChat){

        // io.to(userId).emit("update_message", emitResult({
        //     statusCode: 404,
        //     success: false,
        //     message: "No chat found to update",
            
        //   }
        // ));

       return;
    }

    // console.log(updatedChat);
    const result = await MessageModel.updateMany({
        _id: {$in: updatedChat.messages}, receiver: userId, isRead: false
    },{
        $set: { isRead : true }
    },{new:true});

    console.log(result);
    // io.to(userId).emit("update_message", emitResult({
    //     statusCode: 200,
    //     success: true,
    //     message: "Updated message as seen true",
    //     data: result
    //   }
    // ));
}



//start/initiate chat controller
export const initiateChat = socketCatchAsync(
  async (socket,io,payload) => {
    const { userId } = socket.user;
    const { receiverId } = payload;

    validateSocketFields(socket,payload,["receiverId"]);

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
        // Broadcast to user means send msg to sender
        io.to([userId,receiverId]).emit(
          "chat_initiate",
          emitResult({
            statusCode: 201,
            success: true,
            message: "Retrieved your old chat",
            data: existChat,
          })
        );

        //send notification
        postNotification("New message Request",`You have received a new conversation request from name: ${user.name}`, receiverId);

        // postNotification("You started a new conversation",`You have started a new conversation with name: ${receiver.name} email: ${receiver.email} chatId: ${existChat}`, userId);
        sendNewMessageEmail(receiver.email,{name: receiver.name});

        return;
    }

    //create new chat
    const newChat = await ChatModel.create({ participants: [userId,receiverId], messages: [] });

    //send notification
    postNotification("New message Request",`You have received a new conversation request from name: ${user.name}`, receiverId);

    postNotification("You started a new conversation",`You have started a new conversation with name: ${receiver.name}`, userId);
    //send email
    sendNewMessageEmail(receiver.email,{name: receiver.name});

    // Broadcast to sender and receiver simultaneously
        io.to([userId,receiverId]).emit(
          "chat_initiate",
          emitResult({
            statusCode: 201,
            success: true,
            message: "Chat initiated successfully",
            data: newChat,
          })
        );

  }
);

//get chat list controller
export const getChatList = socketCatchAsync(
  async (socket,io,payload) => {

    validateSocketFields(socket,payload,["userId"]);

    const user = payload.userId;
    // console.log(user);
    // const userId = payload.userId;
    const userId = mongoose.Types.ObjectId.createFromHexString(user);
    // const objectId = new mongoose.Types.ObjectId(stringId); // correct type
    // console.log('get chat list');
    //get all chatlist by a user
    // const chats = await ChatModel.find({participants: { $in: [user]}}).populate({path:"participants",select:"name image"});

    //agregation pipeline
    const chats = await ChatModel.aggregate([
      // 1. Get chats where user is a participant
      {
        $match: { participants: { $in: [userId] } }
      },

      // 2. Lookup all messages of this chat (sorted by createdAt DESC)
      {
        $lookup: {
          from: "messages",
          let: { messageIds: "$messages" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$messageIds"] } } },
            { $sort: { createdAt: -1 } } // newest first
          ],
          as: "messages"
        }
      },

      // 3. Extract lastMessage (the first in sorted array)
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$messages", 0] }
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

      // 6. Remove current user from participants
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

      // 7. Keep only necessary fields
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

      // 8. Sort chats by lastMessage.createdAt
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);


    
    if(!chats){

      io.to(user).emit("chat_list",emitResult({
          statusCode: 404,
          success: false,
          message: "No chat list found",

        })
      );
      return;
    }
    // console.log(chats);

    io.to(user).emit("chat_list",emitResult({
        statusCode: 200,
        success: true,
        message: "Retrieved all chat list",
        data: chats
      })
    );

  }
);

//get all message controller
export const getAllMessage = socketCatchAsync(
  async (socket,io,payload) => {

    validateSocketFields(socket,payload,["chatId"]);
    const chatId = payload.chatId;
    const userId = socket.user.userId;

    // Update unread messages to read first (assuming fetching messages means the user is viewing the chat)
    // await updateMessage(socket, io, { chatId });

    //get chat messages
    const chats = await ChatModel.findOne({
        _id: chatId
    }).populate([ { path: "participants" , select: "name image mobile" },{path: "messages",select:"sender receiver message createdAt"}]).lean();

    if(!chats){
        io.to(userId).emit(
          "chat_message",
          emitResult({
            statusCode: 404,
            success: false,
            message: "No message found",
        
          })
        );

        return;
    }
    // console.log(chats);

    io.to(userId).emit(
      "chat_message",
      emitResult({
        statusCode: 201,
        success: true,
        message: "Got all message",
        data: chats,
      })
    );

    // Refresh the chat list for the current user to reflect updated unreadCount in real-time
    // await getChatList(socket, io, { userId });
    // await updateMessage(socket, io, { chatId });
  }
);

//update message isRead:true controller
export const updateMessage = socketCatchAsync(

  async (socket, io, payload) => {
    validateSocketFields(socket, payload, ["chatId"]);

    const userId = socket.user.userId;
    const chatId = payload.chatId;

    const updatedChat = await ChatModel.findById(chatId);
    if (!updatedChat) {
      io.to(userId).emit("update_message", emitResult({
        statusCode: 404,
        success: false,
        message: "No chat found to update",
      }));
      return;
    }

    // Find the IDs of unread messages for this user in this chat
    const unreadMessages = await MessageModel.find({
      _id: { $in: updatedChat.messages },
      receiver: userId,
      isRead: false
    }).select('_id').lean();

    const messageIds = unreadMessages.map(m => m._id.toString());

    // Update them to read
    const result = await MessageModel.updateMany(
      { _id: { $in: messageIds } },
      { $set: { isRead: true } }
    );

    // Find the other participant
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const otherId = updatedChat.participants.find(p => !p.equals(userObjectId)).toString();

    // Emit to the current user (receiver)
    // io.to(userId).emit("update_message", emitResult({
    //   statusCode: 200,
    //   success: true,
    //   message: "Updated messages as seen",
    //   data: { modifiedCount: result.modifiedCount, messageIds, chatId }
    // }));

    // If updates happened, emit to the other user (sender) for real-time update
    // if (result.modifiedCount > 0) {
    //   io.to(otherId).emit("update_message", emitResult({
    //     statusCode: 200,
    //     success: true,
    //     message: "Your messages have been seen",
    //     data: { modifiedCount: result.modifiedCount, messageIds, chatId }
    //   }));

      // Refresh the chat list for both users to reflect updated unreadCount
    // }
    await getChatList(socket, io, { userId });
    await getChatList(socket, io, { userId: otherId });
  }
);
  

//send message controller
export const sendMessage = socketCatchAsync(async (socket, io, payload) => {

  validateSocketFields(socket, payload, ["receiverId", "chatId", "message"]);
  const { receiverId, chatId, message } = payload;
  const userId = socket.user.userId;

  const existingChat = await ChatModel.findOne({
    _id: chatId,
    participants: { $all: [userId, receiverId] },
  });

  if (!existingChat){
    return emitError(socket, 404, "Chat room not found between these users");
  }

  const newMessage = await MessageModel.create({
    sender: userId,
    receiver: receiverId,
    message,
  });

  // notify both user and driver upon new message
  // postNotification("New message", message, receiverId);
  // postNotification("New message", message, userId);

  await Promise.all([
    ChatModel.updateOne({ _id: chatId }, { $push: { messages: newMessage._id } }),
  ]);

  // return newMessage;
  // NEW: Trigger getAllMessage for both sender and receiver to refresh message list
  await getAllMessage(socket, io, { chatId }); // For sender
  await getAllMessage({ ...socket, user: { userId: receiverId } }, io, { chatId }); // For receiver

  // NEW: Refresh chat lists for both users to update last message/unread count in real-time
  // await refreshChatListForUser(io, userId);
  // await refreshChatListForUser(io, receiverId);
  await getChatList(socket, io, { userId });
  await getChatList(socket, io, {userId: receiverId});
});


