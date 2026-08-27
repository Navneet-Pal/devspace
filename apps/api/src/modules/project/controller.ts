import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { StatusCode } from "../../constants/statusCode.js";

import { projectService } from "./service.js";

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await projectService.createProject(
      req.params.workspaceId as string,
      req.user._id.toString(),
      req.body,
    );

    return res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          project,
          "Project created successfully.",
        ),
      );
  },
);

export const getWorkspaceProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const projects = await projectService.getWorkspaceProjects(
      req.params.workspaceId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          projects,
          "Projects fetched successfully.",
        ),
      );
  },
);

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProject(
    req.params.workspaceId as string,
    req.params.projectId as string,
  );

  return res
    .status(StatusCode.OK)
    .json(
      new ApiResponse(StatusCode.OK, project, "Project fetched successfully."),
    );
});

export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await projectService.updateProject(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.user._id.toString(),
      req.body,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          project,
          "Project updated successfully.",
        ),
      );
  },
);

export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    await projectService.deleteProject(
      req.params.workspaceId as string,
      req.params.projectId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(StatusCode.OK, null, "Project deleted successfully."),
      );
  },
);
