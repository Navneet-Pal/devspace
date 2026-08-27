import { Types } from "mongoose";
import { Project } from "./model.js";
import { CreateProjectDTO, UpdateProjectDTO } from "./types.js";

export class ProjectRepository {
  async create(data: CreateProjectDTO) {
    return Project.create(data);
  }

  async findById(projectId: string | Types.ObjectId) {
    return Project.findById(projectId);
  }
  async findByWorkspaceId(workspaceId: string | Types.ObjectId) {
    return Project.find({ workspaceId }).sort({ createdAt: -1 });
  }

  async findByWorkspaceAndName(
    workspaceId: string | Types.ObjectId,
    name: string,
  ) {
    return Project.findOne({ workspaceId, name }).sort({ createdAt: -1 });
  }
  async update(projectId: string | Types.ObjectId, data: UpdateProjectDTO) {
    return Project.findByIdAndUpdate(projectId, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(projectId: string) {
    return Project.findByIdAndDelete(projectId);
  }
}

export const projectRepository = new ProjectRepository();
