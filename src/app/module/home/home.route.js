import express from "express";
import { updatePrivacyPolicy, getPrivacyPolicy, gettermsAndCondition, helpAndSupportController, homePageSearch, updateTermsAndCondition } from "./home.controller.js";


const homeRouter = express.Router();

homeRouter.get("/home-search", homePageSearch);
homeRouter.post("/help-and-support", helpAndSupportController);

homeRouter.patch("/update-privacy-policy", updatePrivacyPolicy);
homeRouter.get("/get-privacy-policy", getPrivacyPolicy);

homeRouter.patch("/update-terms-condition", updateTermsAndCondition);
homeRouter.get("/get-terms-condition", gettermsAndCondition);


export default homeRouter;