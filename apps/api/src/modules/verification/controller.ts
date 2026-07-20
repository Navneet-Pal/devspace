
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { VerificationService } from "./service.js";
import { ApiError } from "../../utils/ApiError.js"; 

const verificationService = new VerificationService;

export const verifyEmail = asyncHandler(async (req:Request, res:Response) => {
    const token = req.query.token as string;
    
    if(!token){
        throw new ApiError(400,"Verification token is required");
    }

    await verificationService.verifyEmail(token);

    return res.status(200).json({
        success: true,
        message : "Email verified successfully",
    })
});