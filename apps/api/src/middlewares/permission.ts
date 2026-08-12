import { NextFunction, Request, Response } from "express";
import { Permission } from "../constants/permission.js";
import { ROLE_PERMISSIONS } from "../constants/rolePermission.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCode } from "../constants/statusCode.js";


export const authorize = (permission : Permission) =>{

    return (req:Request, res:Response, next : NextFunction) =>{
        const role = req.workspaceMember.role;
        const permissions = ROLE_PERMISSIONS[role];

        if(!permissions.includes(permission)){
            throw new ApiError(StatusCode.FORBIDDEN, "You don't have permission to perform this action.");
        }

        next();
    };
};