import { Types } from "mongoose";

import { IWorkspace } from "../modules/workspace/types.js";
import { IWorkspaceMember } from "../modules/workspaceMember/types.js";
import { IProjectMember } from "../modules/projectMember/types.js";
import { IProject } from "../modules/project/types.js"; 

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: Types.ObjectId;
        email: string;
      };

      workspace: IWorkspace;

      workspaceMember: IWorkspaceMember;

      project: IProject;

      projectMember: IProjectMember;
    }
  }
}

export {};
