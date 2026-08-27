export const PERMISSION = {
  // Workspace
  WORKSPACE_CREATE: "workspace:create",
  WORKSPACE_READ: "workspace:read",
  WORKSPACE_UPDATE: "workspace:update",
  WORKSPACE_DELETE: "workspace:delete",

  // Member
  MEMBER_INVITE: "member:invite",
  MEMBER_REMOVE: "member:remove",
  MEMBER_UPDATE_ROLE: "member:update_role",

  // Project
  PROJECT_CREATE: "project:create",
  PROJECT_READ: "project:read",
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",
  PROJECT_ARCHIVE: "project:archive",

  // Task
  TASK_CREATE: "task:create",
  TASK_READ: "task:read",
  TASK_UPDATE: "task:update",
  TASK_DELETE: "task:delete",
  TASK_ASSIGN: "task:assign",
  TASK_CHANGE_STATUS: "task:change_status",
  TASK_CHANGE_PRIORITY: "task:change_priority",

  // Comment
  COMMENT_CREATE: "comment:create",
  COMMENT_UPDATE: "comment:update",
  COMMENT_DELETE: "comment:delete",

  // Attachment
  ATTACHMENT_UPLOAD: "attachment:upload",
  ATTACHMENT_DELETE: "attachment:delete",

  // Activity
  ACTIVITY_READ: "activity:read",

  // Notification
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_UPDATE: "notification:update",

  // Project Member

  PROJECT_MEMBER_READ: "project_member:read",
  PROJECT_MEMBER_ADD: "project_member:add",
  PROJECT_MEMBER_UPDATE_ROLE: "project_member:update_role",
  PROJECT_MEMBER_REMOVE: "project_member:remove",
} as const;

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];

export const PERMISSIONS = Object.values(PERMISSION);
