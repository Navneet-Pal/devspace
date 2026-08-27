export const PROJECT_ROLE = {
  ADMIN: "PROJECT_ADMIN",
  MEMBER: "PROJECT_MEMBER",
  VIEWER: "PROJECT_VIEWER",
} as const;

export type ProjectRole =
  (typeof PROJECT_ROLE)[keyof typeof PROJECT_ROLE];

export const PROJECT_ROLES =
  Object.values(PROJECT_ROLE);