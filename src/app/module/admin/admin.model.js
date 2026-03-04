import mongoose from "mongoose";
import {ENUM_ADMIN_PERMISSION, ENUM_ADMIN_ROLE} from "../../../helper/enum.js";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: "" },

  role: {
    type: String,
    enum: Object.values(ENUM_ADMIN_ROLE),
    default: ENUM_ADMIN_ROLE.ADMIN,
  },

  permissions: [
    {
      type: String,
      enum: Object.values(ENUM_ADMIN_PERMISSION),
    },
  ],
  
  verificationCode: { type: String, default: "" },
  isBlocked: { type: Boolean, default: false },

},{timestamps: true});

const AdminModel = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default AdminModel;


/*
permissions: {
  user: {
    user: { type: Boolean, default: false },
    blockUser: { type: Boolean, default: false },
    deleteUser: { type: Boolean, default: false },
  },

  listing: {
    listing: { type: Boolean, default: false },
    approveListing: { type: Boolean, default: false },
    rejectListing: { type: Boolean, default: false },
    deleteListing: { type: Boolean, default: false },
    editListing: { type: Boolean, default: false },
    addMetadata: { type: Boolean, default: false },
  },

  earning: {
    earning: { type: Boolean, default: false },
    totalEarning: { type: Boolean, default: false },
    earningGrowthChart: { type: Boolean, default: false },
    transactionHistory: { type: Boolean, default: false },
  },

  category: {
    category: { type: Boolean, default: false },
    addCategory: { type: Boolean, default: false },
    editCategory: { type: Boolean, default: false },
    deleteCategory: { type: Boolean, default: false },
  },

  coupon: {
    coupon: { type: Boolean, default: false },
    addCoupon: { type: Boolean, default: false },
    editCoupon: { type: Boolean, default: false },
    deleteCoupon: { type: Boolean, default: false },
  },

  blog: {
    blog: { type: Boolean, default: false },
    addBlog: { type: Boolean, default: false },
    editBlog: { type: Boolean, default: false },
    deleteBlog: { type: Boolean, default: false },
  },

  faq: {
    faq: { type: Boolean, default: false },
    addFaq: { type: Boolean, default: false },
    editFaq: { type: Boolean, default: false },
    deleteFaq: { type: Boolean, default: false },
  },

  subscription: {
    subscription: { type: Boolean, default: false },
    editPrice: { type: Boolean, default: false },
    editFeature: { type: Boolean, default: false },
    subscriberList: { type: Boolean, default: false },
  },

  legal: {
    nda: { type: Boolean, default: false },
    privacyPolicy: { type: Boolean, default: false },
    termsConditions: { type: Boolean, default: false },
    refundPolicy: { type: Boolean, default: false },
  },
}
*/
