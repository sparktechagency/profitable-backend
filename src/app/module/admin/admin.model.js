import {Schema,models,model} from "mongoose";


const AdminSchema = new Schema({
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

const AdminModel = models.Admin || model("Admin", AdminSchema);

export default AdminModel;
