import type { ApiResponse } from "@/types/apiTypes";

export type FileResourceType = "image" | "raw" | "video";

export interface FileUploader {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ProjectFile {
  _id: string;

  workspaceId: string;
  projectId: string;

  uploadedBy: FileUploader;

  originalName: string;

  publicId: string;
  secureUrl: string;

  resourceType: FileResourceType;

  mimeType: string;

  size: number;

  deletedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export type GetProjectFilesResponse = ApiResponse<ProjectFile[]>;

export type GetProjectFileResponse = ApiResponse<ProjectFile>;

export type UploadProjectFileResponse = ApiResponse<ProjectFile>;

export type DeleteProjectFileResponse = ApiResponse<null>;
