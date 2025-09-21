//create a query builder class
class QueryBuilder{
    //constructor
    constructor(modelQuery,query){
        this.modelQuery = modelQuery,
        this.query = query
    }

    //search method
    search(searchableFields){
        const searchTerm = this.query?.searchTerm;
        if(searchTerm){
            this.modelQuery = this.modelQuery.find({ $or: searchableFields.map((field) => ({
                [field]: {$regex: searchTerm, $options: "i"}
            }))}).collation({ locale: "en", strength: 2});
        }

        return this;
    }


}
