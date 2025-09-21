import express from "express";
import { getAllChats, getChatMessages, initiateChat, updateMessageAsSeen } from "./chat.controller.js";
import { authorizeUser } from "../../middleware/AuthMiddleware.js";
// const auth = require("../../middleware/auth");
// const config = require("../../../config");

const chatRouter = express.Router();

chatRouter.post("/post-chat",authorizeUser , initiateChat);

chatRouter.get("/get-chat-message", getChatMessages);

chatRouter.get("/get-all-chat",authorizeUser, getAllChats);

chatRouter.patch("/update-message", authorizeUser, updateMessageAsSeen);

export default chatRouter;
