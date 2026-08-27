import { axiosInstance } from "@/lib/axios";

import type {
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskResponse,
  GetProjectTasksResponse,
  GetTaskResponse,
  GetWorkspaceTasksResponse,
  UpdateTaskAssigneeRequest,
  UpdateTaskAssigneeResponse,
  UpdateTaskPositionRequest,
  UpdateTaskPositionResponse,
  UpdateTaskPriorityRequest,
  UpdateTaskPriorityResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  UpdateTaskStatusRequest,
  UpdateTaskStatusResponse,
} from "./types";

class TaskService {
  async getWorkspaceTasks(
    workspaceId: string,
  ): Promise<GetWorkspaceTasksResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/tasks`,
    );

    return response.data;
  }

  async getProjectTasks(
    workspaceId: string,
    projectId: string,
  ): Promise<GetProjectTasksResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    );

    return response.data;
  }

  async getTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
  ): Promise<GetTaskResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    );

    return response.data;
  }

  async createProjectTask(
    workspaceId: string,
    projectId: string,
    data: CreateTaskRequest,
  ): Promise<CreateTaskResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks`,
      data,
    );

    return response.data;
  }

  async updateTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: UpdateTaskRequest,
  ): Promise<UpdateTaskResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
      data,
    );

    return response.data;
  }

  async updateTaskStatus(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: UpdateTaskStatusRequest,
  ): Promise<UpdateTaskStatusResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/status`,
      data,
    );

    return response.data;
  }

  async updateTaskPriority(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: UpdateTaskPriorityRequest,
  ): Promise<UpdateTaskPriorityResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/priority`,
      data,
    );

    return response.data;
  }

  async updateTaskAssignee(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: UpdateTaskAssigneeRequest,
  ): Promise<UpdateTaskAssigneeResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/assignee`,
      data,
    );

    return response.data;
  }

  async updateTaskPosition(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: UpdateTaskPositionRequest,
  ): Promise<UpdateTaskPositionResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/position`,
      data,
    );

    return response.data;
  }

  async deleteTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
  ): Promise<DeleteTaskResponse> {
    const response = await axiosInstance.delete(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    );

    return response.data;
  }
}

export const taskService = new TaskService();
