import { NextFunction, Request, Response } from "express";

import { ProjectPermission } from "../constants/projectPermission.js";
import { PROJECT_ROLE_PERMISSIONS } from "../constants/projectRolePermission.js";
import { ProjectRole } from "../constants/projectRole.js";
import { ROLE_PERMISSIONS } from "../constants/rolePermission.js";

import { ApiError } from "../utils/ApiError.js";
import { StatusCode } from "../constants/statusCode.js";

const WORKSPACE_FALLBACK_PERMISSIONS = new Set<ProjectPermission>([
  "project_member:read",

  "task:read",

  /*
   * Workspace members can participate in task discussion.
   */
  "comment:create",

  "activity:read",

  "document:read",
  "document:create",
  "document:update",

  "file:read",
  "file:upload",
]);

export const projectAuthorize = (permission: ProjectPermission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    /*
     * Explicit project member:
     * use project-level role permissions.
     */
    if (req.projectMember) {
      const role = req.projectMember.role as ProjectRole;

      const permissions = PROJECT_ROLE_PERMISSIONS[role];

      if (!permissions?.includes(permission)) {
        throw new ApiError(
          StatusCode.FORBIDDEN,
          "You don't have permission to perform this action.",
        );
      }

      next();
      return;
    }

    /*
     * No project-member record:
     * user must at least be a workspace member.
     */
    if (!req.workspaceMember) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You are not a member of this workspace.",
      );
    }

    const workspaceRole = req.workspaceMember.role;

    const workspacePermissions = ROLE_PERMISSIONS[workspaceRole] ?? [];

    /*
     * Some permissions already exist in the
     * workspace permission system.
     */
    const hasWorkspacePermission = workspacePermissions.includes(
      permission as (typeof workspacePermissions)[number],
    );

    /*
     * Safe project-level operations that workspace
     * members can perform without a ProjectMember
     * record.
     */
    const hasWorkspaceFallbackPermission =
      WORKSPACE_FALLBACK_PERMISSIONS.has(permission);

    if (!hasWorkspacePermission && !hasWorkspaceFallbackPermission) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You don't have permission to perform this action.",
      );
    }

    next();
  };
};
