// utils/generateUniqueSlug.ts
import slugify from "slugify";
import BusinessModel from "../app/module/business/business.model.js";

export const generateUniqueSlug = async (title,businessId) => {

  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (
    await BusinessModel.exists({
      slug,
      ...(businessId && { _id: { $ne: businessId } }),
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// import { generateUniqueSlug } from "../utils/generateUniqueSlug";

// businessSchema.pre("save", async function (next) {
//   if (!this.isModified("title")) return next();

//   this.slug = await generateUniqueSlug(
//     this.title,
//     this._id?.toString()
//   );

//   next();
// });


// businessSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();
//   const title = update?.title || update?.$set?.title;

//   if (!title) return next();

//   const businessId = this.getQuery()._id;

//   const slug = await generateUniqueSlug(title, businessId);

//   update.$set = update.$set || {};
//   update.$set.slug = slug;

//   next();
// });

