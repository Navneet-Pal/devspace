import { axiosInstance } from "@/lib/axios";

import type {
  DeleteProjectFileResponse,
  GetProjectFileResponse,
  GetProjectFilesResponse,
  UploadProjectFileResponse,
} from "./types";

class FileService {
  async getProjectFiles(
    workspaceId: string,
    projectId: string,
  ): Promise<GetProjectFilesResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/files`,
    );

    return response.data;
  }

  async getProjectFile(
    workspaceId: string,
    projectId: string,
    fileId: string,
  ): Promise<GetProjectFileResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/files/${fileId}`,
    );

    return response.data;
  }

  async uploadProjectFile(
    workspaceId: string,
    projectId: string,
    file: File,
  ): Promise<UploadProjectFileResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/files`,
      formData,
    );

    return response.data;
  }

  async deleteProjectFile(
    workspaceId: string,
    projectId: string,
    fileId: string,
  ): Promise<DeleteProjectFileResponse> {
    const response = await axiosInstance.delete(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/files/${fileId}`,
    );

    return response.data;
  }
}

export const fileService = new FileService();
