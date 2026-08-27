import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { StatusCode } from "../../constants/statusCode.js";

import { commentService } from "./service.js";

export const createProjectComment = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await commentService.createProjectComment(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.user._id.toString(),
      req.body,
    );

    return res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          comment,
          "Comment created successfully.",
        ),
      );
  },
);

export const createTaskComment = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await commentService.createTaskComment(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.user._id.toString(),
      req.body,
    );

    return res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          comment,
          "Comment created successfully.",
        ),
      );
  },
);

export const getProjectComments = asyncHandler(
  async (req: Request, res: Response) => {
    const comments = await commentService.getProjectComments(
      req.params.projectId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          comments,
          "Project comments fetched successfully.",
        ),
      );
  },
);

export const getTaskComments = asyncHandler(
  async (req: Request, res: Response) => {
    const comments = await commentService.getTaskComments(
      req.params.projectId as string,
      req.params.taskId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          comments,
          "Task comments fetched successfully.",
        ),
      );
  },
);

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await commentService.updateComment(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.commentId as string,
      req.user._id.toString(),
      req.projectMember.role,
      req.body,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          comment,
          "Comment updated successfully.",
        ),
      );
  },
);

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    await commentService.deleteComment(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.commentId as string,
      req.user._id.toString(),
      req.projectMember.role,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(StatusCode.OK, null, "Comment deleted successfully."),
      );
  },
);
