import { NextFunction, Request, Response } from "express";
import { Permission } from "../constants/permission.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { workspaceMemberRepository } from "../modules/workspaceMember/repository.js";
import { ApiError } from "../utils/ApiError.js";
import { ROLE_PERMISSIONS } from "../constants/rolePermission.js";


export const authorize = (...permissions : Permission[]) => asyncHandler( async( req:Request,res:Response,next:NextFunction) =>{
    const userId = req.user._id.toString();
    const {workspaceId } = req.params as {
        workspaceId : string;
    }

    const member = await workspaceMemberRepository.findByUserAndWorkspace(workspaceId,userId);

    if(!member){
        throw new ApiError(403,"You are not a member of this workspace");
    }

    const rolePermission = ROLE_PERMISSIONS[member.role];

    const hasPermission = permissions.some( (permission) => rolePermission.includes(permission)  );

    if(!hasPermission){
        throw new ApiError(403,"You do not have permission to perform this action");
    }

    next();

});