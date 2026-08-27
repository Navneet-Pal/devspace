import { NextFunction, Request, Response } from "express";

import { ProjectPermission } from "../constants/projectPermission.js";

import { PROJECT_ROLE_PERMISSIONS } from "../constants/projectRolePermission.js";

import { ProjectRole } from "../constants/projectRole.js";

import { ApiError } from "../utils/ApiError.js";
import { StatusCode } from "../constants/statusCode.js";

export const projectAuthorize = (permission: ProjectPermission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const projectMember = req.projectMember;

    if (!projectMember) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You are not a member of this project.",
      );
    }

    const role = projectMember.role as ProjectRole;

    const permissions = PROJECT_ROLE_PERMISSIONS[role];

    if (!permissions.includes(permission)) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You don't have permission to perform this action.",
      );
    }

    next();
  };
};
