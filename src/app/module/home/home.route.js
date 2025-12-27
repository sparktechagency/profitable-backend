import express from "express";
import { updatePrivacyPolicy, getPrivacyPolicy, gettermsAndCondition, helpAndSupportController, homePageSearch, updateTermsAndCondition, updateRefundPolicy,getRefundPolicy } from "./home.controller.js";
// import RefundCancellationModel from "./refund.model.js";


const homeRouter = express.Router();

homeRouter.get("/home-search", homePageSearch);
homeRouter.post("/help-and-support", helpAndSupportController);

homeRouter.patch("/update-privacy-policy", updatePrivacyPolicy);
homeRouter.get("/get-privacy-policy", getPrivacyPolicy);

homeRouter.patch("/update-terms-condition", updateTermsAndCondition);
homeRouter.get("/get-terms-condition", gettermsAndCondition);

//refund and cancellation policy routes
// homeRouter.post("/create-refund-cancellation", async (req, res) => {
//     const {description} = req.body;
//     if(!description) return res.status(400).json({message: "Description is required to create refund and cancellation policy"});
//     const resp = await RefundCancellationModel.create({description});
//     if(!resp) return res.status(500).json({message: "Failed to create refund and cancellation policy"});
//     return res.status(201).json({message: "Refund and cancellation policy created", data: resp});
// });

homeRouter.patch("/update-refund-policy", updateRefundPolicy);
homeRouter.get("/get-refund-policy", getRefundPolicy);


export default homeRouter;