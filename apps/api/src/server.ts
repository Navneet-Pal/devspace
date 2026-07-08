
import app from "./app.js";
import "dotenv/config";
import {env} from "./config/env.js";
import { connectDB } from "./config/db.js";

const startServer  = async()=>{
    try{
        await connectDB();
        app.listen(env.PORT,()=>{
            console.log("server started")
        })
    }
    catch(error){
        console.log("failed to start sever");
        process.exit(1);
    }
};

startServer();

