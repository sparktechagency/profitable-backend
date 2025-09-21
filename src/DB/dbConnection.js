import mongoose from "mongoose";
import config from "../config/index.js";

 const mongoDBConnection = async () => {
    try {
        await mongoose.connect(config.database_url);
        console.log("database connected successfully");
        
        
    } catch (error) {
        console.log(error);
        console.log("Failed to connect mongodb");
        
    }
}

export default mongoDBConnection;