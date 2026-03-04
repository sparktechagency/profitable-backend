import {Router} from "express";
import { adminChangePassword, adminLogin, adminResetPassword, adminSentOtp, adminVerifyOtp, blockAdmin, createNewAdmin, deleteAdmin, editAdmin, editAdminDetails, getAdminDetails, getAllAdmin, getSingleAdmin } from "./admin.controller.js"; 
import { auth } from "../../middleware/AuthMiddleware.js";
import { ENUM_ADMIN_ROLE } from "../../../helper/enum.js";
import multer from "multer";
import path from "path";

const adminRouter = Router();


//define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-image");
  },
  filename: (req, file, cb) => {
    //extract the file extension from filename
    const fileExtension = path.extname(file.originalname);

    const fileName = file.originalname.replace(fileExtension, "").toLowerCase().split(" ").join("-") +"-" + Date.now();

    cb(null, fileName + fileExtension);
  },
});

// preapre the final multer upload object
var upload = multer({
  storage: storage,

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB . less than 10mb file allowed
  },

  fileFilter: (req, file, cb) => {
   
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {

        cb(null, true);

      } else {
        cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
      }
    
  },
});

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
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]),
    createNewAdmin
);

adminRouter.get("/get-single-admin/:id", 
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]),
    getSingleAdmin
);

adminRouter.get("/get-all-admin", 
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]),
    getAllAdmin
);

adminRouter.patch("/edit-admin/:id", 
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]),
    editAdmin
);

adminRouter.delete("/delete-admin/:id", 
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]),
    deleteAdmin
);

adminRouter.patch("/block-admin/:id", 
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]),
    blockAdmin
);

adminRouter.get("/get-admin-detail",
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN, ENUM_ADMIN_ROLE.ADMIN]),
    getAdminDetails
);

adminRouter.patch("/edit-admin-detail",
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN, ENUM_ADMIN_ROLE.ADMIN]),
    upload.single("profile-image"),
    editAdminDetails
);

adminRouter.patch("/admin-change-password",
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN, ENUM_ADMIN_ROLE.ADMIN]),
    adminChangePassword
);

export default adminRouter;