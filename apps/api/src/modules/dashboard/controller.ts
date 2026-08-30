import { Request, Response } from "express";

import { StatusCode } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import { dashboardService } from "./service.js";

export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await dashboardService.getDashboard(
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          dashboard,
          "Dashboard fetched successfully.",
        ),
      );
  },
);
