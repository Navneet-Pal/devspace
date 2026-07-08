import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoles from "./modules/auth/routes.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);


app.get("/health",(req,res)=>{
    res.status(200).json({
        success : true,
        message : "server is healty"
    })
});

app.use("/api/auth",authRoles);
app.use(errorHandler);

export default app;