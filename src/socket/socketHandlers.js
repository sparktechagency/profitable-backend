// const { EnumSocketEvent, EnumUserRole } = require("../util/enum");
import socketCatchAsync from "../utils/socketCatchAsync.js";
import { getAllMessage, getChatList, initiateChat, sendMessage, updateMessage } from "./chat.socket.controller.js";
import {validateUser,updateOnlineStatus} from "./socket.controller.js";

export const socketHandlers = socketCatchAsync(async (socket, io) => {
  console.log("Trying to connect socket");

  // const userId = socket.handshake.query.userId;
  const userId = socket.user.userId;

  const user = validateUser(socket, io, { userId });
  if (!user) return;

  socket.join(userId);

  console.log(userId, "user connected");

  await updateOnlineStatus(socket, io, {
    userId,
    isOnline: true,
  });

  //start/intiate chat route
  socket.on("chat_initiate", async(payload) => {
      initiateChat(socket,io,{...payload});
  });
  //retrieve chat list in real time route
  socket.on("chat_list", async(payload) => {
      getChatList(socket,io,{...payload});
  });
  //retrieve message in realtime route
  socket.on("chat_message", async(payload) => {
      getAllMessage(socket,io,{...payload});
      updateMessage(socket,io,{...payload});
  });
  
  //send realtime message route
  socket.on("send_message", async (payload) => {
    sendMessage(socket, io, { ...payload });
  });

  //send realtime message route
  // socket.on("update_message", async (payload) => {
  //   updateMessage(socket, io, { ...payload });
  // });

  //if user disconnected then update user's isOnline status
  socket.on("disconnect", () => {
    updateOnlineStatus(socket, io, {
      userId,
      isOnline: false,
    });

    console.log(userId, "user disconnected");
  });
});

