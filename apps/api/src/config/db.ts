import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async ()=>{ 
    try{
        await mongoose.connect(env.MONGODB_URL);
        console.log("MONGODB connected");
    }catch(error){
        console.log("DB connection Failed");
        console.error(error);
        process.exit(1);
    }
};