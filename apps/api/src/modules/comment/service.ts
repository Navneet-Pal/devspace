import { Types } from "mongoose";

import { StatusCode } from "../../constants/statusCode.js";
import { PROJECT_ROLE, ProjectRole } from "../../constants/projectRole.js";
import { ApiError } from "../../utils/ApiError.js";

import { projectMemberRepository } from "../projectMember/repository.js";
import { projectRepository } from "../project/repository.js";
import { taskRepository } from "../task/repository.js";
import { activityService } from "../activity/service.js";
import { ACTIVITY_TYPE } from "../activity/types.js";

import { commentRepository } from "./repository.js";

import type { CreateCommentInput, UpdateCommentInput } from "./types.js";

class CommentService {
  async createProjectComment(
    workspaceId: string,
    projectId: string,
    userId: string,
    data: CreateCommentInput,
  ) {
    await this.validateProject(workspaceId, projectId);

    await this.validateMentions(projectId, data.mentions ?? []);

    const comment = await commentRepository.create(
      new Types.ObjectId(workspaceId),
      new Types.ObjectId(projectId),
      null,
      new Types.ObjectId(userId),
      {
        ...data,
      },
    );

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.COMMENT_CREATED,
      {
        commentId: comment._id.toString(),
      },
    );

    return comment;
  }

  async createTaskComment(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    data: CreateCommentInput,
  ) {
    await this.validateProject(workspaceId, projectId);

    await this.validateTask(projectId, taskId);

    await this.validateMentions(projectId, data.mentions ?? []);

    const comment = await commentRepository.create(
      new Types.ObjectId(workspaceId),
      new Types.ObjectId(projectId),
      new Types.ObjectId(taskId),
      new Types.ObjectId(userId),
      {
        ...data,
      },
    );

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.COMMENT_CREATED,
      {
        commentId: comment._id.toString(),
      },
      taskId,
    );

    return comment;
  }

  async getProjectComments(projectId: string) {
    return commentRepository.findByProject(new Types.ObjectId(projectId));
  }

  async getTaskComments(projectId: string, taskId: string) {
    await this.validateTask(projectId, taskId);

    return commentRepository.findByTask(
      new Types.ObjectId(projectId),
      new Types.ObjectId(taskId),
    );
  }

  async updateComment(
    workspaceId: string,
    projectId: string,
    commentId: string,
    userId: string,
    projectRole: ProjectRole,
    data: UpdateCommentInput,
  ) {
    const comment = await this.getComment(projectId, commentId);

    this.checkCommentModificationPermission(comment, userId, projectRole);

    await this.validateMentions(projectId, data.mentions ?? []);

    const updatedComment = await commentRepository.updateById(
      new Types.ObjectId(commentId),
      new Types.ObjectId(projectId),
      {
        ...data,
      },
    );

    if (!updatedComment) {
      throw new ApiError(StatusCode.NOT_FOUND, "Comment not found.");
    }

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.COMMENT_UPDATED,
      {
        commentId,
      },
      comment.taskId ? comment.taskId.toString() : undefined,
    );

    return updatedComment;
  }

  async deleteComment(
    workspaceId: string,
    projectId: string,
    commentId: string,
    userId: string,
    projectRole: ProjectRole,
  ) {
    const comment = await this.getComment(projectId, commentId);

    this.checkCommentModificationPermission(comment, userId, projectRole);

    const deletedComment = await commentRepository.softDelete(
      new Types.ObjectId(commentId),
      new Types.ObjectId(projectId),
    );

    if (!deletedComment) {
      throw new ApiError(StatusCode.NOT_FOUND, "Comment not found.");
    }

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.COMMENT_DELETED,
      {
        commentId,
      },
      comment.taskId ? comment.taskId.toString() : undefined,
    );

    return deletedComment;
  }

  private async getComment(projectId: string, commentId: string) {
    const comment = await commentRepository.findById(
      new Types.ObjectId(commentId),
      new Types.ObjectId(projectId),
    );

    if (!comment) {
      throw new ApiError(StatusCode.NOT_FOUND, "Comment not found.");
    }

    return comment;
  }

  private async validateProject(workspaceId: string, projectId: string) {
    const project = await projectRepository.findById(
      new Types.ObjectId(projectId),
    );

    if (!project) {
      throw new ApiError(StatusCode.NOT_FOUND, "Project not found.");
    }

    if (project.workspaceId.toString() !== workspaceId) {
      throw new ApiError(StatusCode.NOT_FOUND, "Project not found.");
    }
  }

  private async validateTask(projectId: string, taskId: string) {
    const task = await taskRepository.findById(
      new Types.ObjectId(taskId),
      new Types.ObjectId(projectId),
    );

    if (!task) {
      throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
    }
  }

  private async validateMentions(projectId: string, mentionIds: string[]) {
    if (mentionIds.length === 0) {
      return;
    }

    const uniqueMentionIds = [...new Set(mentionIds)];

    for (const mentionId of uniqueMentionIds) {
      const projectMember = await projectMemberRepository.findByProjectAndUser(
        projectId,
        mentionId,
      );

      if (!projectMember) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "All mentioned users must be members of this project.",
        );
      }
    }
  }

  private checkCommentModificationPermission(
    comment: {
      authorId: Types.ObjectId;
    },
    userId: string,
    projectRole: ProjectRole,
  ) {
    const isAuthor = comment.authorId.toString() === userId;

    if (projectRole === PROJECT_ROLE.ADMIN) {
      return;
    }

    if (!isAuthor) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You can only modify your own comments.",
      );
    }
  }
}

export const commentService = new CommentService();
