import { NextFunction, Request, Response } from "express";

import { StatusCode } from "../constants/statusCode.js";
import { ApiError } from "../utils/ApiError.js";

import { projectRepository } from "../modules/project/repository.js";

export const projectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const workspaceId = req.params.workspaceId as string;
  const projectId = req.params.projectId as string;

  const project = await projectRepository.findById(projectId);

  if (!project) {
    throw new ApiError(StatusCode.NOT_FOUND, "Project not found.");
  }

  if (project.workspaceId.toString() !== workspaceId) {
    throw new ApiError(
      StatusCode.BAD_REQUEST,
      "Project does not belong to this workspace.",
    );
  }

  /*
   * Project membership is intentionally NOT required here.
   *
   * A workspace member can open/access a project that belongs
   * to their workspace. Project-level permissions are handled
   * separately by projectAuthorize().
   *
   * This keeps project existence/ownership validation separate
   * from project-level authorization.
   */
  req.project = project;

  next();
};
