import { Request, Response } from "express";
import { workspaceService } from "./service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { StatusCode } from "../../constants/statusCode.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const workspace = await workspaceService.createWorkspace(
      req.body,
      req.user._id,
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
  },
);

export const getWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const workspace = await workspaceService.getWorkspaceById(
      req.params.workspaceId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          workspace,
          "Workspace fetched successfully.",
        ),
      );
  },
);

export const getMyWorkspaces = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaces = await workspaceService.getMyWorkspaces(req.user._id);

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          workspaces,
          "Workspaces fetched successfully.",
        ),
      );
  },
);

export const updateWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const workspace = await workspaceService.updateWorkspace(
      req.params.workspaceId as string,
      req.body,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          workspace,
          "Workspace updated successfully.",
        ),
      );
  },
);

export const deleteWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    await workspaceService.deleteWorkspace(req.params.workspaceId as string);

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(StatusCode.OK, null, "Workspace deleted successfully."),
      );
  },
);

export const updateWorkspaceLogo = asyncHandler(async (req:Request, res:Response) => {
  const workspace = await workspaceService.updateLogo(
    req.params.workspaceId as string,
    req.file,
  );

  return res
    .status(StatusCode.OK)
    .json(
      new ApiResponse(
        StatusCode.OK,
        workspace,
        "Workspace logo updated successfully.",
      ),
    );
});
