import { Request, Response } from "express";

import { StatusCode } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import { fileService } from "./service.js";

export const uploadProjectFile = asyncHandler(
  async (req: Request, res: Response) => {
    const file = await fileService.uploadProjectFile(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.user._id.toString(),
      req.projectMember.role,
      req.file,
    );

    return res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          file,
          "File uploaded successfully.",
        ),
      );
  },
);

export const getProjectFiles = asyncHandler(
  async (req: Request, res: Response) => {
    const files = await fileService.getProjectFiles(
      req.params.workspaceId as string,
      req.params.projectId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(StatusCode.OK, files, "Files fetched successfully."),
      );
  },
);

export const getProjectFile = asyncHandler(
  async (req: Request, res: Response) => {
    const file = await fileService.getProjectFile(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.fileId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(new ApiResponse(StatusCode.OK, file, "File fetched successfully."));
  },
);

export const deleteProjectFile = asyncHandler(
  async (req: Request, res: Response) => {
    await fileService.deleteProjectFile(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.fileId as string,
      req.user._id.toString(),
      req.projectMember.role,
    );

    return res
      .status(StatusCode.OK)
      .json(new ApiResponse(StatusCode.OK, null, "File deleted successfully."));
  },
);
