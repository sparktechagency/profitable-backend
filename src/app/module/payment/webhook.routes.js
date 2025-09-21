import express from "express";
import { webhookManager } from "./payment.controller.js";

const webhookRouter = express.Router();

webhookRouter.post( "/", express.raw({ type: "application/json" }),
  webhookManager
);

export default webhookRouter;
