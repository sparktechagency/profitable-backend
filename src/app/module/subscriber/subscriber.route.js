import express from "express";
import { createNewSubscriber, retrieveSubscriberList } from "./subscriber.controller.js";


const subscriberRouter = express.Router();

subscriberRouter.post("/create-subscriber", createNewSubscriber );
subscriberRouter.get("/retrieve-subscriber", retrieveSubscriberList);

export default subscriberRouter;