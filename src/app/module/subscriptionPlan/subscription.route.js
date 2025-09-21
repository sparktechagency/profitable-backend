import express from "express";
import { createSubscriptionPlan, dashboardSinglePlanController, getAllSubscriptionPlanByUserRole, getSingleSubscriptionPlan, updateSubscriptionPlan } from "./subscription.controller.js";
import {authorizeUser} from "../../middleware/AuthMiddleware.js";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/get-subscription-plan",authorizeUser, getAllSubscriptionPlanByUserRole);
subscriptionRouter.get("/get-single-subscription-plan", getSingleSubscriptionPlan);

//dashboard
subscriptionRouter.post("/create-subscription", createSubscriptionPlan);
subscriptionRouter.get("/dashboard-single-plan",dashboardSinglePlanController);
subscriptionRouter.patch("/update-subscription-plan", updateSubscriptionPlan);
// subscriptionRouter.patch("/update-subscription-features", updateSubscriptionPlan);


export default subscriptionRouter;