import codeGenerator from "../../../utils/codeGenerator.js";
import validateFields from "../../../utils/validateFields.js";
import AdminModel from "./admin.model.js";





export const createAdminService = async (payload) => {
    const {name,email,password,role,permissions} = payload;

    const existingAdmin = await AdminModel.findOne({ email: payload.email.toLowerCase() });
    if (existingAdmin) {
      throw new ApiError(400, "Admin with this email already exists");
    }

    validateFields(payload, ["name","email","password","role"]);
    
  const admin = await AdminModel.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    permissions
  });

  if (!admin) {
    throw new ApiError(500, "Failed to create new admin. Please try again.");
  }

  return admin;
}

export const updateAdminService = async (adminId, payload) => {
    const {name,password,role,permissions} = payload;

    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      throw new ApiError(404, "Admin not found.");
    }
    
    // Update admin fields if they are provided in payload
    if (name) admin.name = name;
    if (password) admin.password = password;
    if (role) admin.role = role;
    if (permissions) admin.permissions = permissions;

    await admin.save();
    return {
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions
        }
    };
}

export const adminLoginService = async (payload) => {
    const {email,password} = payload;

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      throw new ApiError(404, "Admin not found.");
    }

    if (admin.isBlocked) {
      throw new ApiError(401, "Admin is blocked. Please contact support.");
    }

    if (admin.password !== password) {
      throw new ApiError(401, "Invalid password.");
    }

    // Generate JWT token
    const tokenPayload = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    };
    const accessToken =  createToken(tokenPayload, config.jwt.secret, config.jwt.expires_in);
    
    return { 
        admin:{
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
        }, 
        accessToken 
    };
  }

export const getAllAdminService = async () => {
    const admins = await AdminModel.find({}).select("-password").sort({ createdAt: -1 }).lean();
    return admins;
}

export const getAdminByIdService = async (adminId) => {
    const admin = await AdminModel.findById(adminId).select("-password").lean();
    return admin;
}

//verify Email send Otp service
export const adminSendOtpService = async (payload) => {
    const { email } = payload;

    //check if email is exist or not
    if(!email){
        throw new ApiError(400, "Missing Email Id");
    }

    //check if user exist or not
    const user = await AdminModel.findOne({email: email.toLowerCase() });
    if(!user){
        throw new ApiError(404, "Admin does not exist.");
    }

    //generate code for 3 minutes
    const {code , expiredAt  } =  codeGenerator(3);

    //save otp code and code expiary time in user
    user.verificationCode = code;
    // user.verificationCodeExpire = expiredAt;
    await user.save();


    const data = {
        name: user.name,
        code,
        codeExpireTime: Math.round( (expiredAt - Date.now()) / (60 * 1000)),
    };

    //send email to user
    await sendEmailVerifyEmail(email,data);

    return code;

}

export const adminVerifyOtpService = async (payload) => {
    const {email,code} = payload;
    // console.log(payload);
    //check if email exist or not
    validateFields(payload,['email','code']);

    // if (!email) {
    //     throw new ApiError(400, "Email is required to very otp code");
    // }

    //now check user
    const user = await AdminModel.findOne({email: email.toLowerCase()}).lean();
    // console.log(user);
    if(!user){
         throw new ApiError(404, "Admin not found");
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
    const verifiedUser = await AdminModel.findOneAndUpdate({email: email.toLowerCase()},{
         verificationCode: ""
        },{new: true}).select('name email isEmailVerified');

    // //generate token
    // const tokenPayload = {
    //     userId: user._id,
    //     email: user.email,
    //     role: user.role
    // };

    // const accessToken =  createToken(tokenPayload, config.jwt.secret, config.jwt.expires_in);
    // console.log(accessToken);

    //post notification to admin
    // postNotification("New User Joined",`${user.name} has joined the platform`);
    //send welcome email to user
    // await sendWelcomeEmail(user.email,{name: user.name});

    // return {verifiedUser, accessToken};
    return null;
}

//reset password service
export const adminResetPasswordService = async (payload) => {
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
    const user = await AdminModel.findOne({email: email.toLowerCase() }).lean();
    // console.log(user);
    
    if (!user) {
        throw new ApiError(404, "admin not found!");
    } 
  
    // if (!user.isEmailVerified) {
    //     throw new ApiError(403, "Please complete email verification");
    // }

    //hash password
    // const hashPass = await hashPassword(newPassword);

    //now change password in Database
    const resetPassword = await AdminModel.findOneAndUpdate({email: email.toLowerCase() },{password: newPassword});
    // console.log(resetPassword);
    // await sendPasswordChangeEmail(user.email,{name:user.name});
    return null;
}

export const blockUnblockAdminService = async (adminId) => {

        const admin = await AdminModel.findById(adminId);

        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }

        admin.isBlocked = !admin.isBlocked;
        await admin.save();

        let message = admin.isBlocked ? "Admin has been blocked" : "Admin has been unblocked";

        return message;

}

export const deleteAdminService = async (adminId) => {

    const deletedAdmin = await AdminModel.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
        throw new ApiError(404, "Admin not found to delete.");
    }
    
    return null;
}