import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js"; 
import { workspaceInvitationService } from "./service.js";
import { StatusCode } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/apiResponse.js";



export const inviteMember = asyncHandler( async( req : Request, res:Response) => {

    const invitation = await workspaceInvitationService.inviteMember(
        req.params.workspaceId as string,
        req.body.userId ,
        req.user._id.toString(), // invited by
        req.body.role,
    );

    return res.status(StatusCode.CREATED).json(
        new ApiResponse(StatusCode.CREATED, invitation, "Invitation sent successfully")
    );
});

export const acceptInvitation = asyncHandler(async (req: Request, res: Response) => {
  await workspaceInvitationService.acceptInvitation(req.params.invitationId as string);

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, null, "Invitation accepted successfully."));
});

export const rejectInvitation = asyncHandler(async (req: Request, res: Response) => {
  await workspaceInvitationService.rejectInvitation(req.params.invitationId as string);

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, null, "Invitation rejected successfully."));
});

export const cancelInvitation = asyncHandler(async (req: Request, res: Response) => {
  await workspaceInvitationService.cancelInvitation(req.params.invitationId as string);

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, null, "Invitation cancelled successfully."));
});

export const getWorkspaceInvitations = asyncHandler(async (req: Request, res: Response) => {
  const invitations = await workspaceInvitationService.getWorkspaceInvitations(
    req.params.workspaceId as string,
  );

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, invitations, "Invitations fetched successfully."));
});

export const getMyInvitations = asyncHandler(async (req: Request, res: Response) => {
  const invitations = await workspaceInvitationService.getMyInvitations(
    req.user._id.toString(),
  );

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, invitations, "Invitations fetched successfully."));
});
