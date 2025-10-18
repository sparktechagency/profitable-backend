import express from "express";
import { getAllUsers,getUsersTotalBusiness,dashboardController, blockUserController,allListedBusiness, approveBusinessController, changePasswodController, deleteUser } from "./dashboard.controller.js";


const dashboardRouter = express.Router();

//dashboard
dashboardRouter.get("/dashboard-data", dashboardController);
dashboardRouter.get("/get-all-user", getAllUsers);
dashboardRouter.delete("/delete-user/:userId", deleteUser);
dashboardRouter.patch("/block-user", blockUserController);
dashboardRouter.get("/users-business-statistics", getUsersTotalBusiness);
dashboardRouter.get("/listed-business", allListedBusiness);
//approve a listed business
dashboardRouter.patch("/approve-business", approveBusinessController);

//change-password
dashboardRouter.patch("/admin-change-password", changePasswodController);

export default dashboardRouter;