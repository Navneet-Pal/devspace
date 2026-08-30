import { Request, Response } from "express";

import { StatusCode } from "../../constants/statusCode.js";

import { ApiResponse } from "../../utils/apiResponse.js";

import { asyncHandler } from "../../utils/asyncHandler.js";

import { workspaceInvitationService } from "./service.js";

export const inviteMember = asyncHandler(
  async (req: Request, res: Response) => {
    const invitation = await workspaceInvitationService.inviteMember(
      req.params.workspaceId as string,
      req.body.userId,
      req.user._id.toString(),
      req.body.role,
    );

    return res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          invitation,
          "Invitation sent successfully",
        ),
      );
  },
);

export const acceptInvitation = asyncHandler(
  async (req: Request, res: Response) => {
    const invitation = await workspaceInvitationService.acceptInvitation(
      req.params.invitationId as string,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          invitation,
          "Invitation accepted successfully.",
        ),
      );
  },
);

export const rejectInvitation = asyncHandler(
  async (req: Request, res: Response) => {
    const invitation = await workspaceInvitationService.rejectInvitation(
      req.params.invitationId as string,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          invitation,
          "Invitation rejected successfully.",
        ),
      );
  },
);

export const cancelInvitation = asyncHandler(
  async (req: Request, res: Response) => {
    const invitation = await workspaceInvitationService.cancelInvitation(
      req.params.invitationId as string,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          invitation,
          "Invitation cancelled successfully.",
        ),
      );
  },
);

export const getWorkspaceInvitations = asyncHandler(
  async (req: Request, res: Response) => {
    const invitations =
      await workspaceInvitationService.getWorkspaceInvitations(
        req.params.workspaceId as string,
      );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          invitations,
          "Invitations fetched successfully.",
        ),
      );
  },
);

export const getMyInvitations = asyncHandler(
  async (req: Request, res: Response) => {
    const invitations = await workspaceInvitationService.getMyInvitations(
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          invitations,
          "Invitations fetched successfully.",
        ),
      );
  },
);
