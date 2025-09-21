import express from "express"
import { createNewCoupon, deleteCoupon, getAllCoupon, getSingleCoupon, updateCoupon } from "./coupon.controller.js";


const couponRouter = express.Router();

couponRouter.post("/create-coupon", createNewCoupon);
couponRouter.get("/get-all-coupon", getAllCoupon);
couponRouter.get("/get-single-coupon", getSingleCoupon);
couponRouter.put("/update-coupon", updateCoupon);
couponRouter.delete("/delete-coupon", deleteCoupon);

export default couponRouter;