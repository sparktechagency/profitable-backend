import UserModel from "../app/module/user/user.model.js"
import { emitError } from "./emitError.js";
import { emitResult } from "./emitResult.js";
import socketCatchAsync from "../utils/socketCatchAsync.js";
// import postNotification from "../utils/postNotification.js";
import validateSocketFields from "../utils/validateSocketFields.js";

export const validateUser = socketCatchAsync(async (socket, io, payload) => {
  if (!payload.userId) {
    emitError(
      socket,
      400,
      "userId is required to connect",
      "disconnect"
    );
    return null;
  }

  const user = await UserModel.findById(payload.userId);

  if (!user) {
    emitError(socket, 400, "User not found", "disconnect");
    return null;
  }

  return user;
});

export const updateOnlineStatus = socketCatchAsync(async (socket, io, payload) => {

  validateSocketFields(socket, payload, ["userId", "isOnline"]);
  const { userId, isOnline } = payload;

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { isOnline },
    { new: true }
  );

  socket.emit(
    "online_status",
    emitResult({
      statusCode: 200,
      success: true,
      message: `You are ${updatedUser.isOnline ? "online" : "offline"}`,
      data: { isOnline: updatedUser.isOnline },
    })
  );
});





