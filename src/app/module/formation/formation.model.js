import mongoose from "mongoose";
import slugify from "slugify";

const formationSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Format image is required"],
    },
    title: {
      type: String,
      required: [true, "Format title is required"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    detail: {
      type: String,
      required: [true, "Format details are required"],
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

formationSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});

const FormationModel = mongoose.models.Formation || mongoose.model("Formation", formationSchema);

export default FormationModel;
