import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/services/dashboard/keys";
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

const workspaceActivityKey = (workspaceId: string) => [
  "workspace-dashboard-activity",
  workspaceId,
];

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
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.workspaceList(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.workspaceList(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(
          variables.workspaceId,
          variables.projectId,
          variables.taskId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.workspaceList(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(
          variables.workspaceId,
          variables.projectId,
          variables.taskId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useUpdateTaskPriority = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.workspaceList(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(
          variables.workspaceId,
          variables.projectId,
          variables.taskId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useUpdateTaskAssignee = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.workspaceList(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(
          variables.workspaceId,
          variables.projectId,
          variables.taskId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useUpdateTaskPosition = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.workspaceList(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.workspaceList(variables.workspaceId),
      });

      queryClient.removeQueries({
        queryKey: taskKeys.detail(
          variables.workspaceId,
          variables.projectId,
          variables.taskId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};
