import { axiosInstance } from "@/lib/axios";

import type {
  GetProjectActivityResponse,
  GetTaskActivityResponse,
} from "./types";

class ActivityService {
  async getProjectActivity(
    workspaceId: string,
    projectId: string,
  ): Promise<GetProjectActivityResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/activity`,
    );

    return response.data;
  }

  async getTaskActivity(
    workspaceId: string,
    projectId: string,
    taskId: string,
  ): Promise<GetTaskActivityResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/activity`,
    );

    return response.data;
  }
}

export const activityService = new ActivityService();
