import express from "express";
import { getAllUsers,getUsersTotalBusiness,dashboardController, blockUserController,allListedBusiness, approveBusinessController, changePasswodController, deleteUser, deleteBusinessController, addMetaTag } from "./dashboard.controller.js";
import { auth, requirePermission } from "../../middleware/AuthMiddleware.js";
import { ENUM_ADMIN_PERMISSION, ENUM_ADMIN_ROLE } from "../../../helper/enum.js";


const dashboardRouter = express.Router();

//dashboard
dashboardRouter.get("/dashboard-data", dashboardController);

dashboardRouter.get("/get-all-user", 
    // auth(ENUM_ADMIN_ROLE.SUPER_ADMIN, ENUM_ADMIN_ROLE.ADMIN),
    // requirePermission(ENUM_ADMIN_PERMISSION.USER),
    getAllUsers
);
dashboardRouter.delete("/delete-user/:userId", deleteUser);
dashboardRouter.patch("/block-user", blockUserController);
dashboardRouter.get("/users-business-statistics", getUsersTotalBusiness);
dashboardRouter.get("/listed-business", allListedBusiness);
//approve a listed business
dashboardRouter.patch("/approve-business", approveBusinessController);
dashboardRouter.delete("/delete-business", deleteBusinessController);
dashboardRouter.post("/add-meta-tag", addMetaTag);

//change-password
dashboardRouter.patch("/admin-change-password", changePasswodController);

export default dashboardRouter;