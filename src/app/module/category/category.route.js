import express from "express";
import multer from "multer";
import path from "path";
import { createNewCategory, createSubCategory, deleteCategory,deleteSubCategory, getAllCategoryDashboard, getAllCategoryWebsite, getAllSubCategory, updateCategory, updateSubCategory } from "./category.controller.js";

const categoryRouter = express.Router();


//define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/category-image");
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
    fileSize: 20 * 1024 * 1024, // 20MB . less than 20mb file allowed
  },

  fileFilter: (req, file, cb) => {
   
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {

        cb(null, true);

      } else {
        cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
      }
    
  },
});

//create category
categoryRouter.post("/create-category", upload.single("category-image") , createNewCategory);

//create sub category
categoryRouter.post("/create-sub-category", createSubCategory);

categoryRouter.get("/get-all-category", getAllCategoryWebsite);
categoryRouter.get("/get-category-dashboard", getAllCategoryDashboard);

categoryRouter.get("/get-all-subcategory", getAllSubCategory);


categoryRouter.patch("/update-category",upload.single("category-image") , updateCategory );
categoryRouter.patch("/update-sub-category", updateSubCategory);

categoryRouter.delete("/delete-category", deleteCategory);
categoryRouter.delete("/delete-sub-category", deleteSubCategory);

export default categoryRouter;


[   {    
   "name": "Food & Beverage",   
          "subcategories": [       { "name": "Restaurants & Cafés" },       { "name": "Fast Food & Takeaway" },       { "name": "Bars, Pubs & Lounges" },       { "name": "Coffee Shops" },       { "name": "Catering Services" },       { "name": "Bakeries & Confectionery" },       { "name": "Food Trucks & Kiosks" },       { "name": "Juice Bars & Smoothie Shops" },       { "name": "Food Manufacturing & Processing" },       { "name": "Ice Cream Shops" },       { "name": "Breweries & Wineries" },       { "name": "Specialty Food Stores" },       { "name": "Other Food & Beverage Businesses" }     ]
          
           },   
    {"name": "Retail & E-Commerce",     
          "subcategories": [       { "name": "Clothing & Fashion" },       { "name": "Grocery & Supermarkets" },       { "name": "Electronics & Mobile Shops" },       { "name": "Furniture & Home Décor" },       { "name": "Jewelry & Accessories" },       { "name": "Online Stores & Marketplaces" },       { "name": "Specialty Stores" },       { "name": "Convenience Stores" },       { "name": "Flower Shops" },       { "name": "Pet Shops & Pet Supplies" },       { "name": "Bookstores" },       { "name": "Toy & Hobby Stores" },       { "name": "Other Retail & E-Commerce Businesses" }     ]   
} 
]