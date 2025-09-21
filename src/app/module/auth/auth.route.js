import express from "express";
import { forgetPassword, forgetPasswordVerifyOtp, loginUser, registerUser, resetPassword, verifyEmailSendOtp, verifyEmailVerifyOtp } from "./auth.controller.js";


const authRouter = express.Router();



authRouter.post("/register",  registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/verify-email", verifyEmailSendOtp);
authRouter.patch("/verify-email-check-otp", verifyEmailVerifyOtp);
authRouter.post("/forget-password", forgetPassword);
authRouter.patch("/forget-password-check-otp", forgetPasswordVerifyOtp);
authRouter.patch("/reset-password", resetPassword);

export default authRouter;