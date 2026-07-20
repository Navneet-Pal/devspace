import { Request, Response } from "express";

import { workspaceService } from "./service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { StatusCode } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/apiResponse.js";

class WorkspaceController {
  createWorkspace = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await workspaceService.createWorkspace(
      req.user._id,
      req.body,
    );

    return res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          workspace,
          "Workspace created successfully.",
        ),
      );
  });
}

export const workspaceController = new WorkspaceController();
