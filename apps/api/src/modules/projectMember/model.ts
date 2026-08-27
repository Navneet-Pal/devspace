import mongoose, { Schema } from "mongoose";

import { IProjectMember } from "./types.js";
import { PROJECT_ROLE } from "../../constants/projectRole.js";

const projectMemberSchema = new Schema<IProjectMember>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(PROJECT_ROLE),
      required: true,
      default: PROJECT_ROLE.MEMBER,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// A user can belong to a project only once.
projectMemberSchema.index(
  {
    projectId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

// Get all members of a project.
projectMemberSchema.index({
  projectId: 1,
});

// Get all projects of a user.
projectMemberSchema.index({
  userId: 1,
});

export const ProjectMember = mongoose.model<IProjectMember>(
  "ProjectMember",
  projectMemberSchema,
);
