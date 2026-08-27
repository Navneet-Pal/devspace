"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Task, TaskStatus } from "@/services/task/types";

import { taskKeys } from "@/services/task/keys";

import {
  useUpdateTaskPosition,
  useUpdateTaskStatus,
} from "@/hooks/task/useTask";

import { TaskCard } from "./TaskCard";
import { TaskDetailsDialog } from "./TaskDetailsDialog";
import { activityKeys } from "@/services/activity/keys";

interface TaskBoardProps {
  tasks: Task[];
  workspaceId: string;
  projectId?: string;
  showProject?: boolean;
  projectNames?: Record<string, string>;
  canDrag?: boolean;
  draggableTaskIds?: Set<string>;
}

const columns: {
  status: TaskStatus;
  title: string;
}[] = [
  {
    status: "TODO",
    title: "Todo",
  },
  {
    status: "IN_PROGRESS",
    title: "In Progress",
  },
  {
    status: "IN_REVIEW",
    title: "In Review",
  },
  {
    status: "DONE",
    title: "Done",
  },
];

const getColumnId = (status: TaskStatus) => `column-${status}`;

const getNewPosition = (orderedTasks: Task[], activeTaskId: string) => {
  const activeIndex = orderedTasks.findIndex(
    (task) => task._id === activeTaskId,
  );

  if (activeIndex === -1) {
    return null;
  }

  const previousTask = orderedTasks[activeIndex - 1];

  const nextTask = orderedTasks[activeIndex + 1];

  if (!previousTask && !nextTask) {
    return 1000;
  }

  if (!previousTask) {
    return nextTask.position / 2;
  }

  if (!nextTask) {
    return previousTask.position + 1000;
  }

  return (previousTask.position + nextTask.position) / 2;
};

export const TaskBoard = ({
  tasks,
  workspaceId,
  projectId,
  showProject = false,
  projectNames = {},
  canDrag = false,
  draggableTaskIds,
}: TaskBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const queryClient = useQueryClient();

  const updateTaskStatus = useUpdateTaskStatus();

  const updateTaskPosition = useUpdateTaskPosition();

  const isDraggingDisabled =
    !canDrag || updateTaskStatus.isPending || updateTaskPosition.isPending;

  const invalidateTaskQueries = (activeProjectId: string, taskId: string) => {
    queryClient.invalidateQueries({
      queryKey: taskKeys.projectList(workspaceId, activeProjectId),
    });

    queryClient.invalidateQueries({
      queryKey: taskKeys.workspaceList(workspaceId),
    });

    queryClient.invalidateQueries({
      queryKey: taskKeys.detail(workspaceId, activeProjectId, taskId),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isDraggingDisabled) {
      return;
    }

    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeTaskId = String(active.id);

    if (draggableTaskIds && !draggableTaskIds.has(activeTaskId)) {
      return;
    }

    const overId = String(over.id);

    const activeTask = tasks.find((task) => task._id === activeTaskId);

    if (!activeTask) {
      return;
    }

    const activeProjectId = projectId ?? activeTask.projectId;

    const overTask = tasks.find((task) => task._id === overId);

    const targetColumn = columns.find(
      (column) => getColumnId(column.status) === overId,
    );

    const newStatus =
      targetColumn?.status ?? overTask?.status ?? activeTask.status;

    const currentStatus = activeTask.status;

    /*
     * Same-column reorder
     */
    if (!targetColumn && overTask && newStatus === currentStatus) {
      if (activeTaskId === overTask._id) {
        return;
      }

      const currentColumnTasks = tasks
        .filter((task) => task.status === currentStatus)
        .sort((a, b) => a.position - b.position);

      const oldIndex = currentColumnTasks.findIndex(
        (task) => task._id === activeTaskId,
      );

      const newIndex = currentColumnTasks.findIndex(
        (task) => task._id === overTask._id,
      );

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return;
      }

      const reorderedTasks = arrayMove(currentColumnTasks, oldIndex, newIndex);

      const newPosition = getNewPosition(reorderedTasks, activeTaskId);

      if (newPosition === null || newPosition === activeTask.position) {
        return;
      }

      updateTaskPosition.mutate(
        {
          workspaceId,
          projectId: activeProjectId,
          taskId: activeTaskId,
          data: {
            position: newPosition,
          },
        },
        {
          onSuccess: () => {
            invalidateTaskQueries(activeProjectId, activeTaskId);

            queryClient.invalidateQueries({
              queryKey: activityKeys.projectList(workspaceId, activeProjectId),
            });

            queryClient.invalidateQueries({
              queryKey: activityKeys.taskList(
                workspaceId,
                activeProjectId,
                activeTaskId,
              ),
            });
          },
        },
      );

      return;
    }

    /*
     * Cross-column move
     */
    if (newStatus !== currentStatus) {
      const targetColumnTasks = tasks
        .filter((task) => task.status === newStatus)
        .sort((a, b) => a.position - b.position);

      const tasksWithoutActive = targetColumnTasks.filter(
        (task) => task._id !== activeTaskId,
      );

      let reorderedTasks: Task[];

      if (overTask) {
        const overIndex = tasksWithoutActive.findIndex(
          (task) => task._id === overTask._id,
        );

        if (overIndex === -1) {
          return;
        }

        reorderedTasks = [...tasksWithoutActive];

        reorderedTasks.splice(overIndex, 0, activeTask);
      } else if (targetColumn) {
        reorderedTasks = [...tasksWithoutActive, activeTask];
      } else {
        return;
      }

      const newPosition = getNewPosition(reorderedTasks, activeTaskId);

      if (newPosition === null) {
        return;
      }

      updateTaskStatus.mutate(
        {
          workspaceId,
          projectId: activeProjectId,
          taskId: activeTaskId,
          data: {
            status: newStatus,
          },
        },
        {
          onSuccess: () => {
            updateTaskPosition.mutate(
              {
                workspaceId,
                projectId: activeProjectId,
                taskId: activeTaskId,
                data: {
                  position: newPosition,
                },
              },
              {
                onSuccess: () => {
                  invalidateTaskQueries(activeProjectId, activeTaskId);

                  queryClient.invalidateQueries({
                    queryKey: activityKeys.projectList(
                      workspaceId,
                      activeProjectId,
                    ),
                  });

                  queryClient.invalidateQueries({
                    queryKey: activityKeys.taskList(
                      workspaceId,
                      activeProjectId,
                      activeTaskId,
                    ),
                  });
                },
              },
            );
          },
        },
      );
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = tasks
              .filter((task) => task.status === column.status)
              .sort((a, b) => a.position - b.position);

            return (
              <TaskColumn
                key={column.status}
                status={column.status}
                title={column.title}
                tasks={columnTasks}
                showProject={showProject}
                projectNames={projectNames}
                onTaskClick={setSelectedTask}
                canDrag={canDrag}
                draggableTaskIds={draggableTaskIds}
              />
            );
          })}
        </div>
      </DndContext>

      {selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTask(null);
            }
          }}
          workspaceId={workspaceId}
          projectId={selectedTask.projectId}
        />
      )}
    </>
  );
};

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  showProject: boolean;
  projectNames: Record<string, string>;
  onTaskClick: (task: Task) => void;
  canDrag: boolean;
  draggableTaskIds?: Set<string>;
}

const TaskColumn = ({
  status,
  title,
  tasks,
  showProject,
  projectNames,
  onTaskClick,
  canDrag,
  draggableTaskIds,
}: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: getColumnId(status),
    disabled: !canDrag,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-w-0 rounded-xl border bg-card/50 transition-all duration-200 ${
        canDrag && isOver
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border/70"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{title}</h3>

          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Sortable Tasks */}
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-[160px] space-y-3 p-3">
          {tasks.length === 0 ? (
            <div
              className={`flex min-h-[140px] items-center justify-center rounded-lg border border-dashed transition-colors ${
                canDrag && isOver
                  ? "border-primary/60 bg-primary/5"
                  : "border-border/60"
              }`}
            >
              <p className="text-xs text-muted-foreground">
                {canDrag ? "Drop tasks here" : "No tasks"}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                showProject={showProject}
                projectName={projectNames[task.projectId]}
                onClick={onTaskClick}
                disabled={
                  draggableTaskIds ? !draggableTaskIds.has(task._id) : !canDrag
                }
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};
