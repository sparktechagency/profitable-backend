import express from "express";
import multer from "multer";
import path from "path"
import { getSellerDetail, getUserDetails, updateUserProfile } from "./user.controller.js";
import { authorizeUser } from "../../middleware/AuthMiddleware.js";

const userRouter = express.Router();

//upload business image to local upload folder
// const uploadFolder = "../../../../upload/user-image";

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
    fileSize: 20 * 1024, // 20MB . less than 10mb file allowed
  },

  fileFilter: (req, file, cb) => {
   
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {

        cb(null, true);

      } else {
        cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
      }
    
  },
});

//upload.single("image")

//here have to use userAuthentication middleware
userRouter.get("/user-detail",authorizeUser, getUserDetails );
userRouter.patch("/update-profile",authorizeUser ,upload.single("profile-image"), updateUserProfile);
userRouter.get("/seller-detail", authorizeUser, getSellerDetail);



export default userRouter;