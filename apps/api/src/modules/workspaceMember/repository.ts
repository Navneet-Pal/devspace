import { ClientSession, Types } from "mongoose";
import { WorkspaceMember } from "./model.js";
import { Role } from "../../constants/roles.js";


export class WorkspaceMemberRepository {
    async create(workspaceId : Types.ObjectId, userId : Types.ObjectId, role: Role , session?: ClientSession ){
        return WorkspaceMember.create( [{workspaceId, userId, role}], {session} ).then(
            (result) => result[0]
        );
    };

    async findByUserAndWorkspace(workspaceId : string, userId : string){
        return WorkspaceMember.findOne({workspaceId,userId});
    };

    async updateRole(workspaceId:Types.ObjectId, userId:Types.ObjectId,role:Role){
        return WorkspaceMember.findOneAndUpdate({workspaceId,userId} , {role} ,{new:true});
    };

    async delete(workspaceId:Types.ObjectId, userId:Types.ObjectId){
        return WorkspaceMember.findOneAndDelete({workspaceId, userId});
    }

    async exists(workspaceId:Types.ObjectId, userId:Types.ObjectId ){
        return WorkspaceMember.exists({workspaceId, userId});
    }
};

export const workspaceMemberRepository = new WorkspaceMemberRepository();