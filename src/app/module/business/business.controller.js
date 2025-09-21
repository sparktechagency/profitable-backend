import catchAsync from "../../../utils/catchAsync.js";
import { createNewBusinessService, getAllBusinessService, updateABusinessService, advancedSearchService, getBusinessValuationService, getASingleBusinessByIdWithUsersService, interestedBuyersDetailsService, singleBusinessDetailsService, filterBusinessService, filterBusinessByBusinessRoleService, filterBusinessByMostViewService, filterBusinessByCategoryWithBusinessService, markedBusinessSoldService, featuredBusinessService, deleteBusinessService, topCountryWithMaximumBusinesService, businessIdeaByMostViewService } from "./business.service.js";
import sendResponse from "../../../utils/sendResponse.js";


//api ending point to create a new business
export const createNewBusiness = catchAsync(async (req,res) => {
    const newBusiness = await createNewBusinessService(req);


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "new business created successfully",
        data: newBusiness
    });
});

//api ending point to update a business
export const updateABusiness = catchAsync(async (req,res) => {

     const response = await updateABusinessService(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "business updated successfully",
        data: response
    });
});

//api ending point to get all business
export const getAllBusiness = catchAsync(async (req,res) => {
    const allBusness = await getAllBusinessService()

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "got all listed business",
        data: allBusness
    });
});

//api ending point to get a single business
export const getASingleBusinessWithusers = catchAsync(async (req,res) => {
    const response = await getASingleBusinessByIdWithUsersService(req.user,req.query);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Successfully get a business by id",
        data : {business: response.business, interestedUsers: response.interestedUsers}
    });
});

//api ending point to get a single business
export const deleteBusiness = catchAsync(async (req,res) => {

    const {deleted,message} = await deleteBusinessService(req.query);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: message,
        data : deleted
    });
    
});

//api ending point to get a single business
export const getASingleBusinessDetails = catchAsync(async (req,res) => {

    const response = await singleBusinessDetailsService(req);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Successfully get a business details",
        data : response
    });
    
});



//interested buyers details
export const interestedBuyersDetails = catchAsync( async (req,res) => {

    const {business,interestedUser} = await interestedBuyersDetailsService(req.query);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "retrieved interested buyers details",
        data: {business,interestedUser}
    });
});

//api ending point to implement advanced search
export const advancedBusinessSearch = catchAsync(async (req,res) => {

    const response = await advancedSearchService(req.query);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Advanced search implemented successfully",
        data: response
    });
});

//api ending point to implement business valuation
export const getBusinessValuation = catchAsync(async (req,res) => {

    await getBusinessValuationService(req);

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Your information submitted to admin for further assessment"
    });
});

//filter business by various field
export const filterBusinessByVariousFields = catchAsync (
    async (req,res) => {
        const response = await filterBusinessService(req.query);

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Retrieved business as per your condition",
            meta: response.meta,
            data: response.business
        });
    }
);

//api ending point to filter business by business role
export const filterBusinessByBusinessRole = catchAsync(
    async (req,res) => {

        const response = await filterBusinessByBusinessRoleService(req.query);
        
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "retrieved business as per business role",
            data: response
        });
    }
);

//api ending point to filter business by most viewed
export const filterBusinessByMostView = catchAsync(
    async (req,res) => {

        const response = await filterBusinessByMostViewService(req.query);
        
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "retrieved business as per business view",
            data: response
        });
    }
);

//api ending point to filter business idea by most viewed
export const filterBusineessIdeaByMostView = catchAsync(
    async (req,res) => {

        const response = await businessIdeaByMostViewService(req.query);
        
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "retrieved business idea as per view",
            data: response
        });
    }
);

//api ending point to filter business by top category
export const filterBusinessByCategoryWithBusinessCount = catchAsync(
    async (req,res) => {

        const response = await filterBusinessByCategoryWithBusinessService();
        
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "retrieved business as per business category with business count",
            data: response
        });
    }
);

//api ending point to filter business by top country
export const filterBusinessByCountryWithBusinessCount = catchAsync(
    async (req,res) => {

        const response = await topCountryWithMaximumBusinesService();
        
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "retrieved business as per country with business count",
            data: response
        });
    }
);

//api ending point to mark a business sold
export const markedBusinessAsSold = catchAsync( async (req,res) => {

    const response = await markedBusinessSoldService(req.query);

     sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Changed the status of your business",
            data: response
        });
});

//api ending point to mark a business sold
export const featuredBusinessHomePage = catchAsync( async (req,res) => {
    console.log(req.params,req.query);
    const response = await featuredBusinessService(req.params,req.query);

     sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Got business which business owner's has maximum subscription plan",
            data: response
        });
});

