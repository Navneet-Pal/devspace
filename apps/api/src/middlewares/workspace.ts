import { NextFunction, Request, Response } from "express";
import { workspaceRepository } from "../modules/workspace/repository.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCode } from "../constants/statusCode.js";
import { workspaceMemberRepository } from "../modules/workspaceMember/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const workspaceMiddleware = asyncHandler(async (req: Request, res:Response, next : NextFunction) =>{

    const workspaceId = req.params.workspaceId as string;

    const workspace = await workspaceRepository.findById(workspaceId);

    if(!workspace) throw new ApiError(StatusCode.NOT_FOUND,"Workspace not found");

    const workspaceMember  = await workspaceMemberRepository.findByUserAndWorkspace(workspaceId,req.user._id);

    if(!workspaceMember) throw new ApiError(StatusCode.FORBIDDEN, "You are not a member of this workspace.");

    req.workspace = workspace;
    req.workspaceMember = workspaceMember;

    next();
} );