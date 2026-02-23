import {Router} from "express";
import { adminLogin, adminResetPassword, adminSentOtp, adminVerifyOtp, blockAdmin, createNewAdmin, deleteAdmin, editAdmin, getAllAdmin, getSingleAdmin } from "./admin.controller.js"; 

const adminRouter = Router();

adminRouter.post("/admin-login", 
    adminLogin
);
adminRouter.post("/admin-sent-otp", 
    adminSentOtp

);
adminRouter.post("/admin-verify-otp", 
    adminVerifyOtp
);

adminRouter.patch("/admin-reset-password", 
    adminResetPassword
);    

adminRouter.post("/create-new-admin", 
    createNewAdmin
);

adminRouter.get("/get-single-admin/:id", 
    getSingleAdmin
);

adminRouter.get("/get-all-admin", 
    getAllAdmin
);

adminRouter.patch("/edit-admin/:id", 
    editAdmin
);

adminRouter.delete("/delete-admin/:id", 
    deleteAdmin
);

adminRouter.patch("/block-admin/:id", 
    blockAdmin
);

export default adminRouter;