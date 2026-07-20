import { NextFunction, Request,Response } from "express";
import { AuthService } from "./service.js"
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { env } from "../../config/env.js"; 
import { success } from "zod";

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
        secure:env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge:7*24*60*60*1000,
    })

    return res.status(200).json({
        success:true,
        message: "Login Successful",
        user,
        accessToken,
    });
});

export const me = asyncHandler(async(req:Request, res:Response)=>{
    return res.status(200).json({
        success: true,
        user:req.user,
    });
});

export const logout = asyncHandler( async(req: Request, res: Response, next : NextFunction) =>{
    await authService.logout(req.user._id.toString());

    res.clearCookie("refreshToken");

    return res.status(200).json({
        success: true ,
        message : "Logout Successfully"
    });
});

export const forgotPassword = asyncHandler(async(req : Request, res:Response)=>{
    const data = forgotPasswordSchema.parse(req.body);

    await authService.forgotPassword(data);

    return res.status(200).json({
        success: true, 
        message: "Password reset Email has been sent successfully"
    });
});

export const resetPassword = asyncHandler( async(req:Request, res:Response) =>{
    const data = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(data);

    return res.status(200).json({
        success : true,
        message : "Password reset successfully",
    });
});