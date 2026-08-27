import { Request, Response } from "express";

import { StatusCode } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import { activityService } from "./service.js";

export const getProjectActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const activity = await activityService.getProjectActivity(
      req.params.projectId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          activity,
          "Project activity fetched successfully.",
        ),
      );
  },
);

export const getTaskActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const activity = await activityService.getTaskActivity(
      req.params.projectId as string,
      req.params.taskId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          activity,
          "Task activity fetched successfully.",
        ),
      );
  },
);
