import { Request,Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { workspaceMemberService } from "./service.js";
import { StatusCode } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/apiResponse.js";



export const getWorkspaceMembers = asyncHandler( async(req: Request, res:Response) => {
    const members = await workspaceMemberService.getWorkspaceMember(req.params.workspaceId as string);

    return res.status(StatusCode.OK).json(
        new ApiResponse(StatusCode.OK,members,"Members Fetched  successfully")
    );
});

export const updateMemberRole = asyncHandler( async(req: Request, res:Response) => {
    const response = await workspaceMemberService.updateMemberRole(req.params.workspaceId as string, req.params.memberId as string , req.body.role);
    
    return res.status(StatusCode.OK).json(
        new ApiResponse(StatusCode.OK, response,"Member role updated successfully")
    );
});


export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  await workspaceMemberService.removeMember(
    req.params.workspaceId as string,
    req.params.memberId as string,
  );

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, null, "Member removed successfully."));
});