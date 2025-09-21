import express from "express";
import multer from "multer";
import path from "path";
import { advancedBusinessSearch, createNewBusiness, deleteBusiness, featuredBusinessHomePage, filterBusineessIdeaByMostView, filterBusinessByBusinessRole, filterBusinessByCategoryWithBusinessCount, filterBusinessByCountryWithBusinessCount, filterBusinessByMostView, filterBusinessByVariousFields, getAllBusiness, getASingleBusinessDetails, getASingleBusinessWithusers, getBusinessValuation, interestedBuyersDetails, markedBusinessAsSold, updateABusiness } from "./business.controller.js";
import { authorizeUser } from "../../middleware/AuthMiddleware.js";
// import ApiError from "../../../error/ApiError.js";



const businessRouter = express.Router();

//upload business image to local upload folder
// const uploadFolder = "../../../../upload/business-image";

//define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/business-image");
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
    fileSize: 5000000, // 5MB . less than 5mb file allowed
  },

  fileFilter: (req, file, cb) => {
   
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {

        cb(null, true);

      } else {
        cb( new Error("Only .jpg, .png or .jpeg format allowed!"));
      }
    
  },
});

// Configure multer for file uploads
const uploadPdf = multer({
  dest: 'uploads/pdf', // temp storage, or you can use diskStorage for custom names
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB max per file
  },

  // fileFilter: (req, file, cb) => {
   
  //     if (file.mimetype === "file/pdf") {

  //       cb(null, true);

  //     } else {
  //       cb(new Error("Only .pdf format allowed!"));
  //     }
    
  // }
});


businessRouter.post("/create-business", authorizeUser , upload.single("business_image"), createNewBusiness);
businessRouter.patch("/update-business", authorizeUser,   upload.single("business_image"), updateABusiness);
businessRouter.get("/all-business", getAllBusiness);

businessRouter.get("/single-business", getASingleBusinessDetails);

businessRouter.delete("/delete-business", deleteBusiness);

businessRouter.get("/get-single-business-with-users",authorizeUser, getASingleBusinessWithusers);

businessRouter.get("/interested-buyers-details", interestedBuyersDetails);

businessRouter.get("/advanced-search", advancedBusinessSearch);
//business valuation route
businessRouter.post("/business-valuation",uploadPdf.array('pdfs', 4), getBusinessValuation);

//filter business by various fields
businessRouter.get("/filter-business", filterBusinessByVariousFields);

//filter business by different business role
businessRouter.get("/filter-business-by-business-role", filterBusinessByBusinessRole);

//most viewed
businessRouter.get("/most-viewed", filterBusinessByMostView);
businessRouter.get("/most-viewed-idea", filterBusineessIdeaByMostView);

//category-wise-most-numbered-business
businessRouter.get("/top-category", filterBusinessByCategoryWithBusinessCount);

//top country
businessRouter.get("/top-country",filterBusinessByCountryWithBusinessCount);

//isSold route.
businessRouter.patch("/sold-business", markedBusinessAsSold);

//featured business
businessRouter.get("/featured-business", featuredBusinessHomePage);




export default businessRouter;