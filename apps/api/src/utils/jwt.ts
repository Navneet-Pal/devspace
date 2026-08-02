import jwt from "jsonwebtoken";
import { env } from "../config/env.js";


export const generateAccessToken = (userId : string) =>{
    return jwt.sign(
        {userId},
        env.JWT_ACCESS_SECRET,
        {
            expiresIn : env.JWT_ACCESS_EXPIRES_IN,
        }
    );
};

export const generateRefreshToken = (userId: string)=>{
    return jwt.sign(
        {userId},
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.JWT_REFRESH_EXPIRES_IN,
        }
    )
}

export const verifyRefreshToken = (token:string)  =>{
    return jwt.verify(token,env.JWT_REFRESH_SECRET) as {userId:string;};
};