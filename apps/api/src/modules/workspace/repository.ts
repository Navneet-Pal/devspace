import { ClientSession } from "mongoose";
import { Workspace } from "./model.js";
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from "./types.js";


class WorkspaceRepository{
    async create(data : CreateWorkspaceDTO , session? : ClientSession ){
        return Workspace.create([data] , {session} ).then(
            (result) => result[0]
        );
    }  

    async findById(workspaceId:string){
        return Workspace.findById(workspaceId);
    }

    async update(workspaceId:string, data: UpdateWorkspaceDTO , session?:ClientSession ){
        return Workspace.findByIdAndUpdate(workspaceId,data,{new:true ,session });
    }

    async delete(workspaceId:string ,session? : ClientSession){
        return Workspace.findByIdAndDelete(workspaceId , {session});
    }
}

export const workspaceRepository = new WorkspaceRepository();