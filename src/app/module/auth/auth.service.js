import validateFields from "../../../utils/validateFields.js";
import UserModel from "../user/user.model.js";
import ApiError from "../../../error/ApiError.js";
import {createToken} from "../../../utils/jwtHelpers.js";
import config from "../../../config/index.js";
import codeGenerator from "../../../utils/codeGenerator.js";
import { sendEmailVerifyEmail, sendPasswordChangeEmail, sendResetPasswordEmail, sendWelcomeEmail } from "../../../utils/emailHelpers.js";
import hashPassword, { comapreUserPassword } from "../../../utils/hashPassword.js";
import postNotification from "../../../utils/postNotification.js";
// import bcrypt from "bcrypt";



//user registration service
export const userRegistrationProcess = async (payload) => {

    const {name,email,password,confirmPassword,country,mobile,role} = payload;
    console.log(payload);
    

    //check if all the required fields are available or not
    //if anu of the field is empty then the below function throw an error
    validateFields(payload,["name","email","password","country","mobile","role"]);

    //check password length
    if(password.length < 5){
        throw new ApiError(400,"Password should be at least 5 character");
    }

    //check if both password fields are same
    if (password !== confirmPassword){
        throw new ApiError( 400,"Password and Confirm Password didn't match" );
    }

    //check if user already exist or not
    const user = await UserModel.findOne({email});
    //if user exist then following steps will be followed
    
    if(user && (user.role === role)){
        throw new ApiError(403,"Already you have an account with same Email and Role. So please login");
    }  

    //before saving user, hased the password
    // const hashedPassword = await hashPassword(password);

    //user not exist . so create a new user
    const newUser = await UserModel.create({
        name,email,password,country,mobile,role
    });

    if(!newUser){
        throw new ApiError(500,"Failed to register");
    }

    
    //generate code for 3 minutes
    const {code , expiredAt  } =  codeGenerator(10);
    // console.log(code,expiredAt);
    

    //save otp code and code expiary time in user
    newUser.verificationCode = code;
    newUser.verificationCodeExpire = expiredAt;
    await newUser.save();


    const data = {
        name: newUser.name,
        code,
        // codeExpireTime: Math.round( (expiredAt - Date.now()) / (60 * 1000)),
    };

    //send email to user
    sendEmailVerifyEmail(email,data);
        
             
    return {
        message: "Account created successfully. Verify your email",
        newUser,       
    };

}

//user login service
export const userLoginService = async (payload) => {
    const {email, password ,role} = payload;
    // console.log(email,password,role);
    
    //check if email and password data is available
    validateFields(payload,["email","password","role"]);

    //checkif user exist
    const user = await UserModel.findOne({ email,role}).select({name: true, email: true, role: true,password: true, isEmailVerified: true,isBlocked: true});
    // console.log(user);

    if(!user) {
        throw new ApiError(404,"User not found");
    }

    // Blocked user cannot login
    if (user.isBlocked) {
      throw new ApiError(403, "Your account has been blocked. Contact support to reactivate you account.");
    }
    
    //check if user's email is verified or not
    if(!user.isEmailVerified){
        throw new ApiError(400, "Before login verify your email");
    }
    
    //check if password is matched or not
    // const isPasswordMatched = await bcrypt.compare(password,user.password);

    if(password !== user.password){
        throw new ApiError(400, "Password is incorrect");
    }
    
    //nbw generate token
    const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken =  createToken(tokenPayload, config.jwt.secret, config.jwt.expires_in);

    return {user, accessToken};
}

//verify Email send Otp service
export const verifyEmailSendOtpService = async (payload) => {
    const { email } = payload;

    //check if email is exist or not
    if(!email){
        throw new ApiError(400, "Missing Email Id");
    }

    //check if user exist or not
    const user = await UserModel.findOne({email});
    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    //generate code for 3 minutes
    const {code , expiredAt  } =  codeGenerator(3);

    //save otp code and code expiary time in user
    user.verificationCode = code;
    user.verificationCodeExpire = expiredAt;
    await user.save();


    const data = {
        name: user.name,
        code,
        codeExpireTime: Math.round( (expiredAt - Date.now()) / (60 * 1000)),
    };

    //send email to user
    sendEmailVerifyEmail(email,data);

    return code;

}

export const verifyEmailVerifyOtpService = async (payload) => {
    const {email,code} = payload;

    //check if email exist or not
    validateFields(payload,['email','code']);

    if (!email) {
        throw new ApiError(400, "Email is required to very otp code");
    }

    //now check user
    const user = await UserModel.findOne({email}).lean();

    if(!user){
         throw new ApiError(404, "user not found");
    }

    //check if verification code is avsilable with user not
    if (!user.verificationCode){
        throw new ApiError(  404,  "No verification code. Get a new verification code");
    }

    //now check if verification code matched or not
    if (user.verificationCode !== code){
        throw new ApiError(400, "Invalid verification code!");
    }

    //update user after matching code;
    const verifiedUser = await UserModel.findOneAndUpdate({email},{isEmailVerified: true, verificationCode: null, verificationCodeExpire: null},{new: true}).select('name email isEmailVerified');

    //generate token
    const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };

    const accessToken =  createToken(tokenPayload, config.jwt.secret, config.jwt.expires_in);
    // console.log(accessToken);

    //post notification to admin
    postNotification("New User Joined",`${user.name} has joined the platform`);
    //send welcome email to user
    sendWelcomeEmail(user.email,{name: user.name});

    return {verifiedUser, accessToken};
}

//forget password send otp
export const forgetPasswordService = async (payload) => {
    const { email } = payload;

    //check if email is exist or not
    if(!email){
        throw new ApiError(400, "Email id is required to verify email");
    }

    //check if user exist or not
    const user = await UserModel.findOne({email});
    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    //generate code for 3 minutes
    const {code , expiredAt  } = codeGenerator(10);

    //save otp code and code expiary time in user
    user.verificationCode = code;
    user.verificationCodeExpire = expiredAt;
    await user.save();


    const data = {
        name: user.name,
        code,
        // codeExpireTime: Math.round( (expiredAt - Date.now()) / (60 * 1000)),
    };

    //send email to user
    sendResetPasswordEmail(email,data);

}

//forget password otp verify service 
export const forgetPasswordOtpVerifyService = async (payload) => {
    const {email,code} = payload;

    //check if email exist or not
    if (!email) {
        throw new ApiError(400, "Email id is required to check forget password otp");
    }

    //now check user
    const user = await UserModel.findOne({email});

    if(!user){
         throw new ApiError(404, "user not found");
    }

    //check if verification code is avsilable with user not
    if (!user.verificationCode){
        throw new ApiError(  404,  "No verification code. Get a new verification code");
    }

    //now check if verification code matched or not
    if (user.verificationCode !== code){
        throw new ApiError(400 , "Invalid verification code!");
    }

    //update user after matching code;
    const verifiedUser = await UserModel.findOneAndUpdate({email},{ verificationCode: null, verificationCodeExpire: null},{new: true}).select('name email');

    return verifiedUser;
}

//reset password service
export const resetPasswordService = async (payload) => {
    const {email, newPassword,confirmPassword} = payload;
    // console.log(email,newPassword,confirmPassword);
    
    //check password length
    if(newPassword.length < 5){
        throw new ApiError(400,"Password should be at least 5 character");
    }
    //check if both password fields matched or not
    if (newPassword !== confirmPassword){
        throw new ApiError(400, "Passwords do not match")
    }

    //get user
    const user = await UserModel.findOne({email}).lean();
    // console.log(user);
    
    if (!user) {
        throw new ApiError(404, "User not found!");
    } 
  
    if (!user.isEmailVerified) {
        throw new ApiError(403, "Please complete email verification");
    }

    //hash password
    // const hashPass = await hashPassword(newPassword);

    //now change password in Database
    const resetPassword = await UserModel.findOneAndUpdate({email},{password: newPassword});
    // console.log(resetPassword);
    sendPasswordChangeEmail(user.email,{name:user.name});
    return resetPassword;
}

