import ApiError from "../../../error/ApiError.js";
import validateFields from "../../../utils/validateFields.js";
import InterestedModel from "../interested/interested.model.js";
import BusinessModel from "./business.model.js";
import nodemailer from "nodemailer";
import fs from "fs";
import config from "../../../config/index.js";
import path from "path";
import CategoryModel from "../category/category.model.js";
import UserModel from "../user/user.model.js";
import postNotification from "../../../utils/postNotification.js";
import QueryBuilder from "../../../builder/queryBuilder.js";
import deleteFile from "../../../utils/deleteUnlinkFile.js";
import { newBusinessListingEmail,businessValuationReturnEmail, sendAdminEmail } from "../../../utils/emailHelpers.js";



//utility function
//send notification to all buyer and investor
const sendNotificationToAllBuyerAndInvestor = async (title,country,businessType,role) => {
    //find out all buyer and investor who has subscription plan
    if(role === "Business Idea Lister"){
        const users = await UserModel.find({role: Investor,subscriptionPlanPrice: { $gt: 0 }}).select("name email").lean();
    
        //now send notification to all buyer and investor
        if(users.length > 0){
            for (const user of users) {
                postNotification(
                    "Latest listed Idea",
                    `Business Idea: ${title}, location: ${country},`,
                    user._id
                );
                await newBusinessListingEmail(user.email, {
                    name: user.name,
                    title,
                    country,
                    businessType
                });
            }

        }
    }
    else {

        const users = await UserModel.find({role: { $in: ["Buyer","Investor"]},subscriptionPlanPrice: { $gt: 0 }}).select("name email").lean();
    
        //now send notification to all buyer and investor
        if(users.length > 0){
            for (const user of users ) {
                postNotification(
                    "Latest listed Business",
                    `Business : ${title}, location: ${country},`,
                    user._id
                );
                await newBusinessListingEmail(user.email, {
                    name: user.name,
                    title,
                    country,
                    businessType
                });
            }

        }
    }
}

//create new business service
export const createNewBusinessService = async (req) => {
    const userId = req.user.userId;
    // console.log(userId); 
    const role = req.user.role;
    // console.log(req.file.filename); 
    let images;
    if(req.file){
         images = req.file.filename;
    }
    
    if(!images){
        throw new ApiError(400, "Image is required to create new business");
    }

    const { title, category, subCategory, country, state, city, countryName, askingPrice, price, ownerShipType, businessType, reason, description} = req.body;

    //check if all the fields are available
    validateFields(req.body,[
         "title", "category", "country", "askingPrice", "ownerShipType", "businessType"
    ]);
    
    console.log(country,state,city,countryName);

    //user type and subscription wise different add business functionlity
    const user = await UserModel.findById(userId);

    const businessCount = user.totalBusiness;
    const subscriptionPlanType = user.subscriptionPlanType;

    let newBusiness;
    //create new business function
    const addNewBusiness = async () => {

         newBusiness = await BusinessModel.create({
            user: userId,image: images, title, businessRole: role, category, subCategory, country, state, city,countryName, askingPrice,price, ownerShipType, businessType, reason, description
        });

        //check if business is created or not
        if(!newBusiness){
            throw new ApiError(500,"failed to create new business");
        }

        //update user's total business
        user.totalBusiness = user.totalBusiness + 1;
        await user.save();

        //send notification to admin and user
        postNotification("New Listing Request",`${user.name} listed a new business: ${title}`);

        //send notification to user
        switch(role){
            case "Seller":
                postNotification('Your business listed successfully','Your business Listing has been submitted for admin approval', user._id);
                break;

            case "Broker":
                postNotification('Your business listed successfully','Your business Listing has been submitted for admin approval', user._id);
                break;

            case "Asset Seller":
                postNotification('Your asset listed successfully','Your asset Listing has been submitted for admin approval', user._id);
                break;

            case "Francise Seller":
                postNotification('Your franchise listed successfully','Your Franchise Listing has been submitted for admin approval', user._id);
                break;
                
            case "Business Idea Lister":
                postNotification('Your business idea listed successfully','Your business idea has been submitted for admin approval', user._id);
                break;
                
            default:
                postNotification('Your business listed successfully','Your business Listing has been submitted for admin approval', user._id);
        }

        return newBusiness;
    }

    //Seller add business
    if(role === "Seller"){

        if(subscriptionPlanType){

            //check if user can add new business or not
             if(businessCount >= 1) throw new ApiError(400, "A Seller can't add more than one business");
             
             await addNewBusiness();

        }
        
    }
    else if(role === "Asset Seller") {

         if(subscriptionPlanType === "1 Months"){

            //check if user can add new business or not
            if(businessCount >= 1) throw new ApiError(400, "1 month subscription plan user can't add more than 1 business");

            await addNewBusiness();

         }
        else if(subscriptionPlanType === "3 Months"){

            //check if user can add new business or not
             if(businessCount >= 3) throw new ApiError(400, "3 Months subscription plan user can't add more than 3 business");

             await addNewBusiness();

        }
        else if(subscriptionPlanType === "6 Months"){

            //check if user can add new business or not
             if(businessCount >= 5) throw new ApiError(400, "6 Month subscriptiopn plan user can't add more than 5 business");

             await addNewBusiness();

        }
    }
    else if(role === "Business Idea Lister"){
        //for Business Idea lister there is no limitation to add new Business
        await addNewBusiness();
    }
    else if(role === "Broker"){

         if( subscriptionPlanType === "Basic Broker Package"){

            //check if user can add new business or not
            if(businessCount >= 5) throw new ApiError(400, "Basic broker package subscriptiopn plan user can't add more than 5 business");

            await addNewBusiness();

        }
         else if(subscriptionPlanType === "Professional Broker Package"){

            //check if user can add new business or not
            if(businessCount >= 15) throw new ApiError(400, "Professional broker package subscriptiopn plan user can't add more than 15 business");

            await addNewBusiness();

        }
         else if(subscriptionPlanType === "Premium Broker Package"){

            //check if user can add new business or not
            // if(businessCount >= 5) throw new ApiError(400, "Premium broker package subscriptiopn plan user can't add more than 5 business");

            await addNewBusiness();

        }
    }
    else if(role === "Francise Seller"){

        if(subscriptionPlanType){

            //check if user can add new business or not
            //  if(businessCount >= 1) throw new ApiError(400, "A Francise Seller can't add more than one business");
             
             await addNewBusiness();

        }
    }
    

    if(!newBusiness) throw new ApiError(400,"Failed to add new business");

    //send notification to all buyer and investor that a new business listed
    if(newBusiness){
        //send email to admin also
        await sendAdminEmail(config.smtp.smtp_mail,{name: "Admin", title: newBusiness.title, category: newBusiness.category,country: newBusiness.countryName, updated: false});

        //send email to all buyer and investor
        // sendNotificationToAllBuyerAndInvestor(title,countryName,businessType,role);
    }
}

//update a business service
export const updateABusinessService = async (req) => {
    const {businessId,user} = req.query;
    const { userId,role } = req.user;
    
    if(!businessId || !user){
        throw new ApiError(400, "BusinessId and userId is required to update a business");
    }

    //if user role is Admin then he can update all listed business
    if(role !== "Admin"){
        //check if user can update or not
        if(userId !== user){
            throw new ApiError(403,"You can't update this business");
        }
    }

    //destructure property
    const { title,category, subCategory, country, state, city, countryName, askingPrice, price, ownerShipType, businessType, reason, description} = req.body;
    // console.log(req.body);
    let updatedImage;
    // Step 2: Add new image
    if(req.file){
       updatedImage = req.file.filename;
    }
  
    //no need to validate update service payload . because during updation all fields are not necessery
    //before update store previous listed image to delete 
     const business = await BusinessModel.findById(businessId).select('title user image');
     const oldImages = business.image; //console.log(oldImages);
     
     if (!business)  throw new ApiError(404, "Busines not found to update");
      
    //findout which business instance have to update
    const updatedBusiness = await BusinessModel.findByIdAndUpdate(businessId,{
        image: updatedImage,title,category,subCategory, country, state, city, countryName, askingPrice, price, ownerShipType, businessType, reason, description, isApproved: false
    },{ new: true });

    if(!updatedBusiness){
        throw new ApiError(500, "Failed to update a business");
    }

    //Step 2: Remove old images from filesystem
    if (req.file) {
        deleteFile("business-image",oldImages);
    }
          
    // console.log(updatedBusiness);
    
    //send email to admin also
    if(updatedBusiness){
        //send update notification to user
        postNotification(" Your business is updated", `Your business named ${updatedBusiness.title} is updated and now wait for admin's approval`, updatedBusiness._id);
        
        //send email to admin also
        await sendAdminEmail(config.smtp.smtp_mail,{name: "Admin", title: updatedBusiness.title, category: updatedBusiness.category,country: updatedBusiness.countryName, updated: true});

    }

    
    return updatedBusiness;
}

//get all business service
export const getAllBusinessService = async () => {

    const allBusiness = await BusinessModel.find({ isApproved: true}).sort({ createdAt: -1 });

    //check got all business data or not
    if(!allBusiness){
        throw new ApiError(500,"Failed to get all listed business data");
    }

    return allBusiness;
}

//get a single business by id with interested users
export const getASingleBusinessByIdWithUsersService = async (query) => {
    // const currentUserId = userDetails.userId;
    const {slug} = query;
    // console.log(businessId);
    
    if(!slug){
        throw new ApiError(400,"Business slug is required to get business details");
    }

    //get seller details, check subscription plan if no subscription plan
    // const business = await BusinessModel.findById(businessId).populate({path: "user", select:"subscriptionPlan subscriptionPlanPrice"});

    // const [business,interestedUsers] = await Promise.all([

    //      await BusinessModel.findOne({slug: slug}),
    //      await InterestedModel.find({businessId: business._id}).populate({
    //         path: "userId",
    //         select: "name email image role", // only fetch 'role' from User model
    //      })
    // ]);

    const business = await BusinessModel.findOne({slug: slug});

    if(!business){
        throw new ApiError(500, "No business details found");
    }

    //increment views by 1 if 
    // if (business.user?._id.toString() !== currentUserId.toString()) {
        // await BusinessModel.findByIdAndUpdate(
        //     businessId,
        //     { $inc: { views: 1 } },
        //     { new: true }
        // );
        business.views = business.views + 1;
        await business.save();
    // }

    
    //find out all users who are interested to this business
    const interestedUsers = await InterestedModel.find({businessId: business?._id}).populate({
        path: "userId",
        select: "name email image role", // only fetch 'role' from User model
    });

    //then seller won't see any interested buyer list
//    if(business.user.subscriptionPlan && business.user.subscriptionPlanPrice === 0){

//        return {business,interestedUsers: []}
//    }


    return {business,interestedUsers};

}  

//delete business service
export const deleteBusinessService = async (query) => {
    const { businessId,role } = query;

    if(!businessId) throw new ApiError(400, "Business Id is required to delete a businesss");
    // console.log(businessId,role);
    
    let message = "Successfully deleted your business";
    //delete interestest business from interested collection
    const business = await BusinessModel.findById(businessId).select("title user image");

    if(role === "Broker"){
        const deleteInterset = await InterestedModel.findByIdAndDelete(businessId);
        const deleted = await BusinessModel.findByIdAndDelete(businessId);

        if(deleted){
            const businessCount = await BusinessModel.countDocuments({user: business.user});
            await UserModel.findByIdAndUpdate(business.user,{ 
                    $set: {totalBusiness: businessCount}
            });

            // Delete image from uploads folder if exists
            if (business.image) {
    
                deleteFile("business-image",business.image);
            }
        }



        message = "Successfully deleted";
        return {deleted,message};
    }

    if(role === "Buyer" || role === "Investor" ){

        const deleteInterset = await InterestedModel.findByIdAndDelete(businessId);
        if(!deleteInterset) throw new ApiError(500, "Failed to delete interested business");

        message = "Successfully deleted your interest";

        return {deleteInterset,message};
    }

    // 1️⃣ Find business by ID
    // const business = await BusinessModel.findById(businessId).select("title user image");

    if (!business) {
      throw new ApiError(404, "Business not found to delete");
    }

    // 3️⃣ Delete business from DB
    const deleted = await BusinessModel.findByIdAndDelete(businessId);

    //update user's total business count after deletion
    if(deleted){
        const businessCount = await BusinessModel.countDocuments({user: business.user});
        await UserModel.findByIdAndUpdate(business.user,{ 
                $set: {totalBusiness: businessCount}
        });

        //delete all interest of this business
       await InterestedModel.deleteMany({businessId: businessId});

    }

    // Delete image from uploads folder if exists
    if (business.image) {

       deleteFile("business-image",business.image);
    }

    return {deleted,message};

}

//get single business details
export const singleBusinessDetailsService = async (req) => {
    const {businessId} = req.query;
    // const userId = req.user.userId;
    // console.log(businessId);
    
    if(!businessId){
        throw new ApiError(400,"business id is required to get business details");
    }

    //here you will get a business details and also can mark it as viewed
    //$inc: { views: 1 } will increase the views count by 1 atometically, so even under high traffic, the view count stays consistent.
    const business = await BusinessModel.findById(businessId).lean();

    // if(userId !== business.user){

    //     await BusinessModel.findByIdAndUpdate(businessId,{ $inc: { views: 1 } },{new: true});
    // }

    if(!business){
        throw new ApiError(500, "No business details found on this buisness id");
    }

    //now get interested users who is interested to this business
    //If you don’t need the full data, just the number of users, use .countDocuments() instead — it’s faster and uses less memory:
    const totalInterested = await InterestedModel.countDocuments({ businessId: businessId });

    return {business,totalInterested};

}

//interested buyers details service
export const interestedBuyersDetailsService = async (query) => {
    const {businessId,interestedId } = query;

    validateFields(query,["businessId","interestedId"]);

    const business = await BusinessModel.findById(businessId);
    if(!business){
        throw new ApiError(404,"No business found on this businessId");
    }

    const interestedUser = await InterestedModel.findById(interestedId).populate({path: "userId",select:"image role"});
    if(!interestedUser){
        throw new ApiError(404,"No Interested user found on this InterestedId");
    }

    return {business,interestedUser};

}
//advanced search service
export const advancedSearchService = async (query) => {
    const {category,country,location,askingPrice,businessType,ownerShipType,SortBy} = query;

    //check if it is older first or newest first
    let sortOrder;
    if(SortBy === "Oldest") sortOrder = 1;
    else if(SortBy === "Newest") sortOrder = -1;

    const searchedBusiness = await BusinessModel.aggregate([
      {
         $match: {
            category: category,
            country: country,
            location: location,
            askingPrice: askingPrice, 
            businessType: businessType,
            ownerShipType: ownerShipType
        }
      },
      {
        $sort: { createdAt: sortOrder }
      }
    ]);
    

    if(!searchedBusiness){
        throw new ApiError(404, "No business data found");
    }

    return searchedBusiness;
}

// get business valuation service
export const getBusinessValuationService = async (req) => {
    //destructure all data from payload
    const { ownerName,businessName,email, countryCode, mobile, region, country,location,businessType,category,subCategory, annualTurnover, currency, yearOfEstablishment, annualExpenses,purpose, annualProfit,valueOfAsset,valueOfStock,message } = req.body;
    
    validateFields(req.body,["ownerName","email"]);

        const files = req.files;
        // console.log("files : ",files);
        // Setup Nodemailer
        try {
            
            const transporter = nodemailer.createTransport({
                service: config.smtp.smtp_service,
                auth: {
                    user: config.smtp.smtp_mail,
                    pass: config.smtp.smtp_password, // Use App Password for Gmail with 2FA
                },
            });
    
            // Prepare attachments
            const attachments = files.map(file => ({
                filename: file.originalname,
                path: file.path,
                contentType: 'application/pdf',
            }));
            // console.log("attachment :",attachments);
            
            const mailOptions = {
            from: `${config.smtp.NAME} <${config.smtp.smtp_mail}>`,
            to: config.smtp.smtp_mail,
            subject: 'Detailed information for business valuation',
            text: `Hi This is ${ownerName ? ownerName : "NA"},\n\n
                Here are the details:\n\n
                Owner Name: ${ownerName ? ownerName : "NA"}\n
                Business Name : ${businessName ? businessName : "NA"}\n
                Email: ${email ? email : "NA"}\n
                Country Code : ${countryCode ? countryCode : "NA"}\n
                Mobile : ${mobile ? mobile : "NA"}\n
                Region : ${region ? region : "NA"}\n
                Country : ${country ? country : "NA"}\n
                location : ${location ? location : "NA"}\n
                Business Type : ${businessType ? businessType : "NA"}\n
                Category : ${category ? category : "NA"}\n
                Sub Category : ${subCategory ? subCategory : "NA"}\n
                Annual Turnover : ${annualTurnover ? annualTurnover : "NA"}\n
                Currency : ${currency ? currency : "NA"}\n
                Year Of Establishment : ${yearOfEstablishment ? yearOfEstablishment : "NA"}\n
                Annual Expense : ${annualExpenses ? annualExpenses : "NA"}\n
                Purpose : ${purpose ? purpose : "NA"}\n
                Annual Profit : ${annualProfit ? annualProfit : "NA"}\n
                Value Of Asset : ${valueOfAsset ? valueOfAsset : "NA"}\n
                Value of Stock : ${valueOfStock ? valueOfStock : "NA"}\n
                Message : ${message ? message : "NA"}\n
                
                `,
                attachments,
            };
            // console.log(mailOptions);
            // Send email
            await transporter.sendMail(mailOptions);
    
            // Optional: Delete uploaded files after sending email
            files.forEach(file => fs.unlinkSync(file.path));
    
            // res.status(200).json({ message: 'Email sent successfully!' });
        } 
     catch (error) {
        console.error('Error sending email:', error);
        // res.status(500).json({ message: 'Something went wrong.' });
        throw new ApiError(500,"failed to send email to get your business valuation");
    }

    //send email to user that his info has sent to admin
    await businessValuationReturnEmail(email, {name: ownerName});

}

//filter business service
export const filterBusinessService = async (query) => {
    console.log(query);
    
    //using query builder to execute query
    let businessQuery;
    // if(query.searchText){
    //     businessQuery = new QueryBuilder(
    //         BusinessModel.find({}), query
    //     ).search(["title"]);
    //      query = {};
    // }
    // else if(query.sortBy){
    //     businessQuery = new QueryBuilder(
    //         BusinessModel.find({}), query
    //     ).sort();
    //     query = {};
    // }
    // else if(query.ageOfListing){
    //     businessQuery = new QueryBuilder(
    //         BusinessModel.find({}), query
    //     ).ageOfListing();
    //     query = {};
    // }
    // else{

    //      businessQuery = new QueryBuilder(
    //         BusinessModel.find({}), query
    //     ).filter();
    //     query = {};
    // }

    businessQuery = new QueryBuilder(
           BusinessModel.find({}), query
       ).search(["title"]).filter().sort().ageOfListing().paginate();

    const business = await businessQuery.modelQuery;
    const meta = await businessQuery.countTotal();
    
    return {business,meta};
    
}

//filter business by business role service
export const filterBusinessByBusinessRoleService = async (query) => {
    const { businessRole } = query;

    if (!businessRole) throw new ApiError(400, "Business role is required to filter business by role");

    const business = await BusinessModel.find( { businessRole: businessRole, isApproved: true } );

    if(!business) throw new ApiError(404, "No data found");

    return business;
}

//filter business by business most viewed
export const filterBusinessByMostViewService = async (query) => {
    // console.log(query.role,query.userId);

    //if no user logged in then this api will work
    if(!query.role && !query.userId){
        // if country selected from navabr then country wise business will be displayed
        let filter = { isApproved: true };
        if(query.country){
            filter.country = query.country;
        }
        // if(!query.role && !query.userId)
        const business = await BusinessModel.find(filter).sort({ views: -1});

        if(!business) throw new ApiError(404, "No data found");

        return business;

    }

    //if user logged in then this api will work
    if(query.userId && (query.role === "Seller" || query.role === "Broker" || query.role === "Asset Seller" || query.role === "Francise Seller" || query.role === "Business Idea Lister" ) ){

        const userId = query.userId;
        // console.log('comoing');
        
        const business = await BusinessModel.find({user: userId, isApproved: true}).sort({ views: -1 });

        if(!business) throw new ApiError(404, "No data found");
    
        return business;

    }
    else if(query.role === "Buyer" || query.role === "Investor") {

        let filter = {
            businessRole: { 
                $in: [
                    "Seller",
                    "Francise Seller",
                    "Asset Seller",
                    "Broker",
                ]
            },
            isApproved: true
        }

        if (query.country) { filter.country = query.country } 

       const business = await BusinessModel.find(filter).sort( { views: -1 } );

        if(!business) throw new ApiError(404, "No data found");
                
        return business;
    }

}

//filter business idea by most view
export const businessIdeaByMostViewService = async (query) => {
    let filter = {
        businessRole: "Business Idea Lister",
        isApproved: true
    }

    if (query.country) { filter.country = query.country } 

    const business = await BusinessModel.find(filter).sort( { views: -1 } );

    if(!business) throw new ApiError(404, "No data found");
            
    return business;
}

//filter business by top category service
export const filterBusinessByCategoryWithBusinessService = async () => {
    
    const categories = await BusinessModel.aggregate([
      // Group businesses by category and count them
      {
        $match: { isApproved: true }
      },
      {
        $group: {
          _id: "$category",
          totalBusinesses: { $sum: 1 }
        }
      },
      // Join with Category collection
      {
        $lookup: {
          from: "categories", // MongoDB auto-pluralizes collection names
          localField: "_id",  // category name from business
          foreignField: "categoryName", // category name from category model
          as: "categoryInfo"
        }
      },
      // Flatten the categoryInfo array
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true // in case no matching category image
        }
      },
      // Shape the output
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalBusinesses: 1,
        //   categoryInfo: "$categoryInfo",
          categoryImage: "$categoryInfo.categoryImage"
        }
      },
      // Sort by totalBusinesses (descending)
      {
        $sort: { totalBusinesses: -1 }
      }
    ]);


    return categories;
}

//filter business by top country service
export const topCountryWithMaximumBusinesService = async () => {

    const business = await BusinessModel.aggregate([

        {
            $match: { isApproved: true }
        },
        {
            $group: {
                _id: "$country",
                totalBusinesses: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                country: "$_id",
                totalBusinesses: 1
            }
        },
        {
            $sort: { totalBusinesses: -1 }
        }
    ]);

    if(!business) throw new ApiError(500, "failed to get country with business count");

    return business;

}

//marked your business as sold service
export const markedBusinessSoldService = async (query) => {
    const { businessId, isSold } = query;
    if(!businessId) throw new ApiError(400, "business id is required to mark your business as sold");

    //find business and update isSold
    const business = await BusinessModel.findById(businessId);

    if(!business) throw new ApiError(500, "Failed to get business to mark as sold");

    business.isSold = isSold === 'true' ? true : false;
    business.soldAt = isSold === 'true' ? new Date() : null;
    await business.save();

    return business;
}

//featured business in home page
export const featuredBusinessService = async (params,query) => {
    const {businessRole,country} = query;
    // const {country} = params;
    if(!businessRole) throw new ApiError(400, "businessRole is required");

    // //business role = business idea lister then operation will be different
    if(businessRole === "Business Idea Lister"){
        const business = await BusinessModel.find({businessRole}).sort({views: -1 });
        return business;
    }

    let filter;
    
    if(businessRole === "Seller"){
        if(country){
            filter = { country: country, businessRole: { $in: ["Seller","Broker"] }, isApproved:true }; 
        }else{
            filter = { businessRole: { $in: ["Seller", "Broker"] }, isApproved: true }
        }
    }else{
        if(country){
            filter = { country: country, businessRole: businessRole, isApproved:true }; 
        }else{
            filter = { businessRole: businessRole, isApproved:true };
        }
    }

    const businessesWithMaxPricePlan = await BusinessModel.aggregate([
        // 1️⃣ Match approved businesses with optional country + businessRole filter
        { 
            $match: filter 
        },

        //2️⃣ Join with users (owners)
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userData"
            }
        },
        { $unwind: "$userData" },

        // 3️⃣ Keep only businesses where owner's subscriptionPlanPrice > 0
        {
            $match: {
                "userData.subscriptionPlanPrice": { $gt: 0 }
            }
        },

        // 5️⃣ Sort businesses by subscriptionPlanPrice (highest first)
        {
            $sort: { "userData.subscriptionPlanPrice": -1, createdAt: -1 }
        },

        // 6️⃣ Final projection of required fields
        {
            $project: {
            _id: 1,
            title: 1,
            image: 1,
            category: 1,
            subCategory: 1,
            country: 1,
            location: 1,
            askingPrice: 1,
            businessRole: 1,
            createdAt: 1,
            slug: 1,
            "userData._id": 1,
            "userData.name": 1,
            "userData.email": 1,
            "userData.subscriptionPlanPrice": 1,
            }
        }
    ]);

   
    if(businessesWithMaxPricePlan.length === 0){
        return await BusinessModel.find(filter).sort({ createdAt: -1 }).limit(4).lean();
    }

    // console.log(businessesWithMaxPricePlan);
    return businessesWithMaxPricePlan;
}



