import { useMutation, useQuery } from "@tanstack/react-query";

import { taskKeys } from "@/services/task/keys";
import { taskService } from "@/services/task/service";

import type {
  CreateTaskRequest,
  UpdateTaskAssigneeRequest,
  UpdateTaskPositionRequest,
  UpdateTaskPriorityRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from "@/services/task/types";

export const useWorkspaceTasks = (workspaceId: string) => {
  return useQuery({
    queryKey: taskKeys.workspaceList(workspaceId),

    queryFn: () => taskService.getWorkspaceTasks(workspaceId),

    enabled: !!workspaceId,
  });
};

export const useProjectTasks = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: taskKeys.projectList(workspaceId, projectId),

    queryFn: () => taskService.getProjectTasks(workspaceId, projectId),

    enabled: !!workspaceId && !!projectId,
  });
};

export const useTask = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) => {
  return useQuery({
    queryKey: taskKeys.detail(workspaceId, projectId, taskId),

    queryFn: () => taskService.getTask(workspaceId, projectId, taskId),

    enabled: !!workspaceId && !!projectId && !!taskId,
  });
};

export const useCreateProjectTask = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      data: CreateTaskRequest;
    }) => taskService.createProjectTask(workspaceId, projectId, data),
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      taskId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      taskId: string;
      data: UpdateTaskRequest;
    }) => taskService.updateTask(workspaceId, projectId, taskId, data),
  });
};

export const useUpdateTaskStatus = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      taskId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      taskId: string;
      data: UpdateTaskStatusRequest;
    }) => taskService.updateTaskStatus(workspaceId, projectId, taskId, data),
  });
};

export const useUpdateTaskPriority = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      taskId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      taskId: string;
      data: UpdateTaskPriorityRequest;
    }) => taskService.updateTaskPriority(workspaceId, projectId, taskId, data),
  });
};

export const useUpdateTaskAssignee = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      taskId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      taskId: string;
      data: UpdateTaskAssigneeRequest;
    }) => taskService.updateTaskAssignee(workspaceId, projectId, taskId, data),
  });
};

export const useUpdateTaskPosition = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      taskId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      taskId: string;
      data: UpdateTaskPositionRequest;
    }) => taskService.updateTaskPosition(workspaceId, projectId, taskId, data),
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      taskId,
    }: {
      workspaceId: string;
      projectId: string;
      taskId: string;
    }) => taskService.deleteTask(workspaceId, projectId, taskId),
  });
};
