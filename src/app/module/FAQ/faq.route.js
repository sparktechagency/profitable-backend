import express from "express"
import { createNewFaq, deleteFaq, getAllFaqbyUserRole, updateFaq } from "./faq.controller.js";



const faqRouter = express.Router();

faqRouter.post("/create-faq", createNewFaq);
faqRouter.get("/get-all-faq", getAllFaqbyUserRole);
faqRouter.patch("/update-faq", updateFaq);
faqRouter.delete("/delete-faq", deleteFaq);

export default faqRouter;