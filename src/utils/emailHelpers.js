import status from "http-status";
import ApiError from "../error/ApiError.js";
import sendEmail from "./sendEmail.js";
import otpResendTemp from "../mail/otpResendTemp.js";
import resetPassEmailTemp from "../mail/resetPassEmailTemp.js";
import addAdminEmailTemp from "../mail/addAdminEmailTemp.js";
import subscriptionExpiredTemp from "../mail/subscriptionExpiredTemp.js";
import verifyEmailTemp from "../mail/verifyEmailTemp.js";
import buyerEnquiryEmailTemp from "../mail/buyerEnquiryEmailTemp.js";
import subscriptionEmailTemp from "../mail/subscriptionEmailTemp.js";
import newBusinessListing from "../mail/newBusinessListingTemp.js";
import businessValuationEmailTemp from "../mail/businessValuationEmailTemp.js";
import welcomeEmailTemp from "../mail/welcomeEmailTemp.js";
import listigConfirmationEmailTemp from "../mail/listingConfirmationTemp.js";
import changePasswordConfirmationTemp from "../mail/changePasswordTemp.js";
import newMessageEmailTemp from "../mail/newMesssageTemp.js";



export const sendEmailVerifyEmail = async (email, data) => {
  try {
    await sendEmail({
      email,
      subject: "Verify your email - PBFS Security Code",
      html: verifyEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Email was not sent");
  }
};

export const sendResetPasswordEmail = async (email, data) => {
  try {
    await sendEmail({
      email,
      subject: "Reset password code - PBFS Security Code",
      html: resetPassEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Email was not sent");
  }
};

export const sendBuyersEnquiryEmail = async (email,data) => {
  try {
    await sendEmail({
      email,
      subject: "You have a new enquiry from PBFS",
      html: buyerEnquiryEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Email was not sent");
  }
};

export const sendOtpResendEmail = async (email, data) => {
  try {
    await sendEmail({
      email,
      subject: "New Activation Code",
      html: otpResendTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, "Email was not sent");
  }
};



export const sendAddAdminEmailTemp = async (email, data) => {
  try {
    await sendEmail({
      email,
      subject: "Admin Account Created",
      html: addAdminEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, "Email was not sent");
  }
};

export const sendSubscriptionEmail = async (email, data) => {
  try {
    await sendEmail({
      email,
      subject: "Subscription Activated - Welcome To PBFS",
      html: subscriptionEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const sendSubscriptionExpiredEmail = async (email, data) => {
  try {
    await sendEmail({
      email,
      subject: "Your PBFS subscription has Expired!",
      html: subscriptionExpiredTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const newBusinessListingEmail = async (email, data) => {
  try {
    await sendEmail({
      email,
      subject: "New Business Listed on PBFS - Dont Miss Out!",
      html: newBusinessListing(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const businessValuationReturnEmail = async (email,data) => {
  try {
    await sendEmail({
      email,
      subject: "Your business valuation request - PBFS",
      html: businessValuationEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const sendWelcomeEmail = async (email,data) => {
  try {
    await sendEmail({
      email,
      subject: "Welcome to PBFS - PBFS . Start your journey today",
      html: welcomeEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const sendListingConfirmationEmail = async (email,data) => {
  try {
    await sendEmail({
      email,
      subject: "Your PBFS Password is Updated ",
      html: changePasswordConfirmationTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const sendPasswordChangeEmail = async (email,data) => {
  try {
    await sendEmail({
      email,
      subject: "Your Listing is Now Live on PBFS!",
      html: listigConfirmationEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const sendNewMessageEmail = async (email,data) => {
  try {
    await sendEmail({
      email,
      subject: "You Have a New Message on PBFS ",
      html: newMessageEmailTemp(data),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }
};

