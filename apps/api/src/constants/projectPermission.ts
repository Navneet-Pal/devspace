export const PROJECT_PERMISSION = {
  MEMBER_ADD: "project_member:add",
  MEMBER_READ: "project_member:read",
  MEMBER_UPDATE_ROLE: "project_member:update_role",
  MEMBER_REMOVE: "project_member:remove",

  TASK_CREATE: "task:create",
  TASK_READ: "task:read",
  TASK_UPDATE: "task:update",
  TASK_DELETE: "task:delete",
  TASK_ASSIGN: "task:assign",
  TASK_CHANGE_STATUS: "task:change_status",
  TASK_CHANGE_PRIORITY: "task:change_priority",

  COMMENT_CREATE: "comment:create",
  COMMENT_UPDATE: "comment:update",
  COMMENT_DELETE: "comment:delete",

  ATTACHMENT_UPLOAD: "attachment:upload",
  ATTACHMENT_DELETE: "attachment:delete",

  ACTIVITY_READ: "activity:read",

  DOCUMENT_CREATE: "document:create",
  DOCUMENT_READ: "document:read",
  DOCUMENT_UPDATE: "document:update",
  DOCUMENT_DELETE: "document:delete",

  FILE_READ: "file:read",
  FILE_UPLOAD: "file:upload",
  FILE_DELETE: "file:delete",
} as const;

export type ProjectPermission =
  (typeof PROJECT_PERMISSION)[keyof typeof PROJECT_PERMISSION];

export const PROJECT_PERMISSIONS = Object.values(PROJECT_PERMISSION);
