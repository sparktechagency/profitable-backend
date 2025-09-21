import ApiError from "../error/ApiError.js";
// import status from "http-status";


export default function validateFields(payload, requiredFields){

    //if there is no data in payload
    if(!payload){
        throw new ApiError(400,"Request body is required");
    }

    //loop through all required field
    for(const field of requiredFields){
        if(!payload[field]){
            throw new ApiError(400, `${field} is required`);
        }
    }
}