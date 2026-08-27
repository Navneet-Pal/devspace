import { NextFunction, Request, Response } from "express";

import { StatusCode } from "../constants/statusCode.js";
import { ApiError } from "../utils/ApiError.js";

import { projectRepository } from "../modules/project/repository.js";
import { projectMemberRepository } from "../modules/projectMember/repository.js";

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

  const projectMember = await projectMemberRepository.findByProjectAndUser(
    projectId,
    req.user._id,
  );

  if (!projectMember) {
    throw new ApiError(
      StatusCode.FORBIDDEN,
      "You are not a member of this project.",
    );
  }

  req.projectMember = projectMember;
  req.project = project;

  next();
};
