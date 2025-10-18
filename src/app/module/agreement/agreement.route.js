import express from "express";
import multer from "multer";
import path from "path";
import { createNewAgreement, deleteAgreement, getAllNdaAgreement } from "./agreement.controller.js";
import { authorizeUser } from "../../middleware/AuthMiddleware.js";


const agreementRouter = express.Router();

//define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/NDA");
  },

  filename: (req, file, cb) => {
    //extract the file extension from filename
    const fileExtension = path.extname(file.originalname);

    const fileName = file.originalname.replace(fileExtension, "").toLowerCase().split(" ").join("-") +"-" + Date.now();

    cb(null, fileName + fileExtension);
  },
});

// Configure multer for file uploads
const uploadPdf = multer({
  storage: storage, // temp storage, or you can use diskStorage for custom names
  limits: {
    fileSize: 5 * 1024 * 1024, // 3MB max per file
  },

  fileFilter: (req, file, cb) => {
   
      if (file.mimetype === "application/pdf") {

        cb(null, true);

      } else {
        cb(new Error("Only .pdf format allowed!"));
      }
    
  }
});

agreementRouter.post("/create-agreement",authorizeUser , uploadPdf.array("nda-file",3), createNewAgreement);

//dashboard
agreementRouter.get("/get-all-agreement", getAllNdaAgreement);
agreementRouter.delete("/delete-agreement/:agreementId", deleteAgreement);

export default agreementRouter;