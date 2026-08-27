import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { StatusCode } from "../../constants/statusCode.js";

import { projectMemberService } from "./service.js";

export const getProjectMembers = asyncHandler(
  async (req: Request, res: Response) => {
    const members = await projectMemberService.getProjectMembers(
      req.params.workspaceId as string,
      req.params.projectId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          members,
          "Project members fetched successfully.",
        ),
      );
  },
);

export const addProjectMember = asyncHandler(
  async (req: Request, res: Response) => {
    const member = await projectMemberService.addProjectMember(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.body.userId,
      req.body.role,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          member,
          "Project member added successfully.",
        ),
      );
  },
);

export const updateProjectMemberRole = asyncHandler(
  async (req: Request, res: Response) => {
    const member = await projectMemberService.updateMemberRole(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.memberId as string,
      req.body.role,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          member,
          "Project member role updated successfully.",
        ),
      );
  },
);

export const removeProjectMember = asyncHandler(
  async (req: Request, res: Response) => {
    await projectMemberService.removeProjectMember(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.memberId as string,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          null,
          "Project member removed successfully.",
        ),
      );
  },
);
