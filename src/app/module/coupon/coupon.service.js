import ApiError from "../../../error/ApiError.js";
import validateFields from "../../../utils/validateFields.js"
import CouponModel from "./coupon.model.js";




//create new faq service
export const createNewCouponService = async (payload) => {
    const {couponCode, reason, discount, validFrom, validTo, usageLimit, status } = payload;

    //check if all necessery data is coming or not
    validateFields(payload,["couponCode","reason","discount","validFrom","validTo"]);

    //create new faq
    const newCoupon = await CouponModel.create({couponCode, reason, discount, validFrom, validTo, usageLimit, status});
    if(!newCoupon){
        throw new ApiError(500,"Failed to create new Coupon");
    }

    return newCoupon;
}

//get all faq filtered bu user role
export const getAllCouponService = async (query) => {
    let {page} = query;

    page = parseInt(page) || 1;
    // default limit = 10
    let limit = 10;
    let skip = (page - 1) * limit;

    //filter faq by user role from faq collection
    const allCoupon = await CouponModel.find({}).skip(skip).limit(limit);

    if(!allCoupon){
        throw new ApiError(404,"Failed to get all coupon");
    }

    let total = await CouponModel.countDocuments();
    let totalPage = Math.ceil(total / limit);

    return {page,limit,total,totalPage,allCoupon};
}

//get single coupon
export const getSingleCouponService = async (query) => {
    const {couponCode} = query;
    if(!couponCode) throw new ApiError(400, "Coupon code is required to get coupon details");

    const coupon = await CouponModel.findOne({couponCode});
    if(!coupon) throw new ApiError(404, "No coupon found");

    return coupon;
}

//update a faq service
export const updateCouponService = async (req) => {

    const { couponId } = req.query;

    const {couponCode, reason, discount, validFrom, validTo, usageLimit, status } = req.body;

    //check if all necessery data is coming or not
    validateFields(req.body,["couponCode","reason","discount","validFrom","validTo"]);

    //update a faq
    const updatedCoupon = await CouponModel.findByIdAndUpdate(couponId,{
        $set:{
           couponCode: couponCode, reason: reason, discount: discount, validFrom: validFrom, validTo: validTo, usageLimit: usageLimit, status: status
        }
    },{new: true});

    //check if faq is updated or not
    if(!updatedCoupon){
        throw new ApiError(500,"Failed to update coupon");
    }

    return updatedCoupon;
}

//delete a faq
export const deleteCouponService = async (query) => {
    const { couponId } = query;

    //if needed convert faqId to mongoose Object id type
    //using createHexString() static method
    if(!couponId){
        throw new ApiError(400, "Coupon Id is required to delete a coupon");
    }
   

    //find faq by id and then delete
    const deletedCoupon = await CouponModel.findByIdAndDelete(couponId);

    //check if it;s deleted or not
    if(!deletedCoupon){
        throw new ApiError(404,"not found coupon and deletion failed");
    }

   

}