import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { getAllChatsService, getChatMessagesService, postNewChatService, updateMessageAsSeenService } from "./chat.service.js";


//api ending point to post chat
export const initiateChat = catchAsync( async (req,res) => {

    const result = await postNewChatService(req.user,req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "new Chat initiated",
        data: result
    });
});

//api ending point to get chat messages
export const getChatMessages = catchAsync(async (req, res) => {

  const result = await getChatMessagesService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chat retrieved",
    data: result,
  });

});

//api ending point to get all chats
export const getAllChats = catchAsync(async (req, res) => {

  const result = await getAllChatsService(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Chat retrieved",
    data: result,
  });

});

//api ending point to update message as seen
export const updateMessageAsSeen = catchAsync(async (req, res) => {

  const result = await updateMessageAsSeenService(req.user, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Message updated as seen",
    data: result,
  });

});