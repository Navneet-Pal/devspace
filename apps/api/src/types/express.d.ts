import { Types } from "mongoose";
import { Role } from "../constants/roles.js";
import { IWorkspace } from "../modules/workspace/types.ts";
import { IWorkspaceMember } from "../modules/workspaceMember/types.ts";

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: Types.ObjectId;
        email: string; 
      };

      workspace : IWorkspace;

      workspaceMember : IWorkspaceMember
    }
  }
}

export {};