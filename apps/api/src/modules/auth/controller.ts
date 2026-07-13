import { NextFunction, Request,Response } from "express";
import { AuthService } from "./service.js"
import { loginSchema, registerSchema } from "./validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";



const authService = new AuthService();

export const register = asyncHandler( async(req:Request,res: Response)=>{

    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);

    res.status(201).json({
        success:true,
        message : "User registered successfully",
        data: user,
    });

});

export const login = asyncHandler(async(req:Request,res:Response) => {
    const data  = loginSchema.parse(req.body);
    
    const {user,accessToken,refreshToken} = await authService.login(data);

    res.cookie("refreshToken" , refreshToken,{
        httpOnly: true,
        secure:false,
        sameSite : "strict",
    })

    return res.status(200).json({
        success:true,
        message: "Login Successful",
        user,
        accessToken,
    });
});