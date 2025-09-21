
class QueryBuilder {

  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields) {
    const searchTerm = this.query?.searchText;
    if (searchTerm) {
      this.modelQuery = this.modelQuery
        .find({
          $or: searchableFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: "i" },
          })),
          isApproved: true
        })
        .collation({ locale: "en", strength: 2 });
    }
    else {
    // If no searchTerm, still enforce isApproved: true
      this.modelQuery = this.modelQuery.find({ isApproved: true });
    }

    return this;
  }

  

  // sort() {
  //   const sort = (this.query?.sort || "").split(",").join(" ") || "-createdAt";
  //   this.modelQuery = this.modelQuery.sort(sort);

  //   return this;
  // }

  sort() {
    const sortBy = this.query?.sortBy;

    if (sortBy === "Newest First") {
      // sort by createdAt desc
      this.modelQuery = this.modelQuery.find({ isApproved: true }).sort({ createdAt: -1 });
    } 
    
    else if (sortBy === "Most Viewed") {
      // sort by views desc
      this.modelQuery = this.modelQuery.find({ isApproved: true }).sort({ views: -1 });
    } 
    
    else if (sortBy === "Price (Low to High)") {
      // we need aggregation because askingPrice is categorical
      this.modelQuery = this.modelQuery.aggregate([
        {
          $match: { isApproved: true }
        },
        {
          $addFields: {
            priceOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$askingPrice", "Under $50k"] }, then: 1 },
                  { case: { $eq: ["$askingPrice", "$50k - $100k"] }, then: 2 },
                  { case: { $eq: ["$askingPrice", "$100k - $250k"] }, then: 3 },
                  { case: { $eq: ["$askingPrice", "$250k - $500k"] }, then: 4 },
                  { case: { $eq: ["$askingPrice", "$500k - 1M"] }, then: 5 },
                  { case: { $eq: ["$askingPrice", "Over 1M"] }, then: 6 },
                ],
                default: 99
              }
            }
          }
        },
        { $sort: { priceOrder: 1 } }
      ]);
    } 
    
    else {
      // fallback: normal mongoose sort param or default
      const sort = (this.query?.sort || "").split(",").join(" ") || "-createdAt";
      this.modelQuery = this.modelQuery.find({ isApproved: true }).sort(sort);
    }

    return this;
  }

  ageOfListing() {
    const ageFilter = this.query?.ageOfListing;

    if (!ageFilter) return this; // no filtering, return everything

    let dateFilter = null;
    const todaysDate = new Date();

    switch (ageFilter) {
      case "Anytime":
        // No date filter, just newest first
        this.modelQuery = this.modelQuery.find({ isApproved: true }).sort({ createdAt: -1 });
        return this;

      case "Last 3 Days":
        todaysDate.setDate(todaysDate.getDate() - 3);
        dateFilter = todaysDate;
        break;

      case "Last 14 Days":
        todaysDate.setDate(todaysDate.getDate() - 14);
        dateFilter = todaysDate;
        break;

      case "Last Month":
        todaysDate.setDate(todaysDate.getDate() - 30);
        dateFilter = todaysDate;
        break;

      case "Last 3 Months":
        todaysDate.setDate(todaysDate.getDate() - 90);
        dateFilter = todaysDate;
        break;

      default:
        return this; // unknown option → do nothing
    }

    if (dateFilter) {
      this.modelQuery = this.modelQuery.find({
        isApproved: true,
        createdAt: { $gte: dateFilter },
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query, isApproved: true };

    const excludeFields = ["searchText", "sort", "limit", "page", "fields","sortBy","ageOfListing"];

    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj);

    return this;
  }

  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields = (this.query?.fields || "").split(",").join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;


/*
const {category,subCategory,country,state,city,location,askingPrice,businessType,ownerShipType,ageOfListing,sortBy,searchText,businessRole} = query;

    // var filterField = { isApproved: true };
    // console.log(filterField);
    
    //filter all data by various query
    if(!category && !subCategory && !country && !location && !askingPrice && !businessType && !ownerShipType && !ageOfListing && !sortBy && !searchText && !businessRole){
        const business = await BusinessModel.find({isApproved: true});
        return business;
    }
    else if(subCategory){
        filterField.subCategory = subCategory;
        console.log(filterField)
        const business = await BusinessModel.find(filterField);
        return business;
    }
    else if(category){
        filterField.category = category;
        console.log(filterField)
        const business = await BusinessModel.find(filterField);
        return business;
    }
    else if(city){
        filterField.city = city;
        console.log(filterField)
        const business = await BusinessModel.find(filterField);
        return business;
    }
    else if(state){
        filterField.state = state;
        console.log(filterField)
        const business = await BusinessModel.find(filterField);
        return business;
    }
    else if(country){
        filterField.country = country;
        console.log(filterField)
        const business = await BusinessModel.find(filterField);
        return business;
    }
    else if(location){
        filterField.location = location;
        console.log(filterField)
        const business = await BusinessModel.find(filterField);
        return business;
    }
    else if(askingPrice){
        filterField.askingPrice = askingPrice;
        console.log(filterField)
        const business = await BusinessModel.find({isApproved: true, askingPrice: askingPrice});
        return business;
    }
    else if(businessType){
        filterField.businessType = businessType;
        console.log(filterField)
        const business = await BusinessModel.find(filterField);
        return business;
    }
    else if(ownerShipType){
        filterField.ownerShipType = ownerShipType;
        console.log(filterField)
        const business = await BusinessModel.find(filterField);
        return business;
    }
*/
