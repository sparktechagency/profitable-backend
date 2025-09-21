import ApiError from "../../../error/ApiError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import validateFields from "../../../utils/validateFields.js";
import CategoryModel from "./category.model.js";
import SubCategoryModel from "./subCategory.model.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import deleteFile from "../../../utils/deleteUnlinkFile.js";



//api ending point to create new category
export const createNewCategory = catchAsync(
    async (req,res) => {
        //to get image name from req.file
        let imageName;
        if(req.file){
            imageName = req.file.filename
        }

        const {categoryName} = req.body;

        if (!categoryName || !imageName){
            throw new ApiError(400," Category name and image is required");
        }

        const category = await CategoryModel.create({categoryName,categoryImage: imageName});
        if(!category) {
            throw new ApiError(500," Failed to create new category");
        }

        sendResponse(res,{
            statusCode: 201,
            success: true,
            message: "Created new category",
            data: category
        });
    }
);

//api ending point to create subcategory
export const createSubCategory = catchAsync(
    async (req,res) => {

        const { name, categoryId } = req.body;
        validateFields(req.body,["name","categoryId"]);

        // make sure category exists
        const category = await CategoryModel.findById(categoryId);
        if (!category) throw new ApiError(404, "Category is needed to create sub category");

        // create subcategory
        const subCategory = new SubCategoryModel({ name, category: categoryId });
        await subCategory.save();

        if(!subCategory) throw new ApiError(500, "Failed to create sub category");

        // push subcategory into category's list
        category.subCategories.push(subCategory._id);
        await category.save();


        sendResponse(res,{
            statusCode: 201,
            success: true,
            message: "successfully created subcategory",
            data: subCategory
        });
    }
);


//api ending point to get all category
export const getAllCategoryDashboard = catchAsync(
    async (req,res) => {

        let {page} = req.query;

        page = parseInt(page) || 1;
        let limit = 6; // default limit = 10
        let skip = (page - 1) * limit;

        const response = await CategoryModel.aggregate([
            {
                $project: {
                    categoryName: 1,
                    categoryImage: 1,
                    subCategories: 1,
                    subCategoryCount: { $size: "$subCategories" } // count array length
                }
            },
            {$skip: skip},
            {$limit: limit}
        ]);

        if(!response) throw new ApiError(404, "Categories and subCategories not found");

        let total = await CategoryModel.countDocuments();
        const totalPage = Math.ceil(total / limit);

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Created new category",
            meta: {page,limit,total,totalPage},
            data: response
        });
    }
);
//api ending point to get all category
export const getAllCategoryWebsite = catchAsync(
     async (req,res) => {

        const response = await CategoryModel.find({}).populate({
            path: "subCategories", select: "-_id name"
        }).select('-_id -createdAt -updatedAt');

        if(!response) throw new ApiError(404, "Categories and subCategories not found");

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "got all category",
            data: response
        });
    }
);

//api ending point to get all subcategory
export const getAllSubCategory = catchAsync(
    async (req,res) => {

        let {categoryId,page} = req.query;
        if(!categoryId) throw new ApiError(400,"Category id is required to get all subcatyegories");

        page = parseInt(page) || 1;
        // default limit = 10
        let limit = 10;
        let skip = (page - 1) * limit;

        const id = new mongoose.Types.ObjectId(categoryId); // from query param

        const response = await SubCategoryModel.aggregate([
            // 1️⃣ Match only subcategories under the given category
            {
                $match: { category: id }
            },

            // 2️⃣ Lookup businesses where Business.subCategory == SubCategory.name
            {
                $lookup: {
                from: "businesses", // collection name for BusinessModel
                let: { subCatName: "$name" }, // use subcategory name
                pipeline: [
                    { $match: { $expr: { $eq: ["$subCategory", "$$subCatName"] } } }
                ],
                as: "businesses"
                }
            },

            // 3️⃣ Add a count field
            {
                $addFields: {
                businessCount: { $size: "$businesses" }
                }
            },

            // 4️⃣ Keep only the fields you need
            {
                $project: {
                _id: 1,
                name: 1,
                category: 1,
                businessCount: 1
                }
            },
            {$skip: skip},
            {$limit: limit}
        ]);

        if(!response) throw new ApiError(404, " subCategories not found");

        let total = await SubCategoryModel.countDocuments({category: categoryId});
        let totalPage = Math.ceil(total / limit);

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Got all sub category",
            meta: {page,limit,total,totalPage},
            data: response
        });
    }
);

//api ending point to update category
export const updateCategory = catchAsync(
    async (req,res) => {

        const { categoryId } = req.query;
        if(!categoryId) {
            throw new ApiError(400,"Category Id is required to update category");
        }
        //handle update image name
        let imageName;
        if(req.file){
            imageName = req.file.filename;
        }

        const { categoryName } = req.body;

        const category = await CategoryModel.findById(categoryId);
        if(!category) throw new ApiError(404,"Category not found to update");

        if(req.file){
            if(category.categoryImage){
                // Step 2: Remove old images from filesystem      
                deleteFile("category-image",category.categoryImage); 
            }
        }

        const response = await CategoryModel.findByIdAndUpdate(categoryId,{
            categoryName,categoryImage: imageName},
            { new: true });

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "updated category succesfully",
            data: response
        });
    }
);
//api ending point to update category
export const updateSubCategory = catchAsync(
    async (req,res) => {

        const { subCategoryId } = req.query;
        const { name } = req.body;

        if(!subCategoryId) {
            throw new ApiError(400," Sub Category Id is required to update category");
        }


        // const category = await SubCategoryModel.findById(subCategoryId);
        
        const response = await SubCategoryModel.findByIdAndUpdate(subCategoryId,{name: name},{ new: true });
        if(!response) throw new ApiError(404,"Sub Category not found to update");

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "updated subcategory succesfully",
            data: response
        });
    }
);



//api ending point delete category
export const deleteCategory = catchAsync(
    async (req,res) => {

         const { categoryId } = req.query;
         if(!categoryId) {
             throw new ApiError(400,"Category Id is required to delete category");
         }

        //  const category = await CategoryModel.findById(categoryId);
        //  if(!category) throw new ApiError(404, "Category not found to delete");

        const response = await CategoryModel.findByIdAndDelete(categoryId);
        if (!response) throw new ApiError(500,"Failed to delete category");

        //delete category image before delete category
        if(response.categoryImage){
            // Step 2: Remove old images from filesystem   
            deleteFile("category-image",response.categoryImage);  
            
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Category deleted successfully",
            data: response
        });
    }
);
//api ending point delete category
export const deleteSubCategory = catchAsync(
    async (req,res) => {

         const { subCategoryId } = req.query;
         if(!subCategoryId) {
             throw new ApiError(400,"Sub Category Id is required to delete category");
         }

        //  const subCategory = await SubCategoryModel.findById(subCategoryId);
        //  if(!subCategory) throw new ApiError(404, "Sub Category not found to delete");
      
        const response = await SubCategoryModel.findByIdAndDelete(subCategoryId);
        if (!response) throw new ApiError(500,"Failed to delete subcategory");
        
        // 2️⃣ Remove its reference from Category.subCategories array
        await CategoryModel.updateOne(
            { _id: response.category },
            { $pull: { subCategories: subCategoryId } }
        );
    
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Sub category deleted successfully",
            data: response
        });
    }
);