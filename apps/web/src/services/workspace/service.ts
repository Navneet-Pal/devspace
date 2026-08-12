import { axiosInstance } from "@/lib/axios";
import {
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  GetWorkspaceResponse,
  GetMyWorkspacesResponse,
  UpdateWorkspaceRequest,
  UpdateWorkspaceResponse,
  DeleteWorkspaceResponse,
  UpdateWorkspaceLogoResponse,
} from "./types";

class WorkspaceService {

    async createWorkspace(data : CreateWorkspaceRequest) : Promise<CreateWorkspaceResponse>{
        const response = await axiosInstance.post("/v1/workspaces" ,data);

        return response.data;
    }

    async getMyWorkspaces() : Promise<GetMyWorkspacesResponse> {
        const response = await axiosInstance.get("/v1/workspaces/me");

        return response.data;
    }

    async getWorkspace( workspaceId : string) : Promise<GetWorkspaceResponse>{
        const response = await axiosInstance.get(`/v1/workspaces/${workspaceId}`);
        return response.data;
    }

    async updateWorkspace (workspaceId: string, data:UpdateWorkspaceRequest) : Promise<UpdateWorkspaceResponse>{
        const response = await axiosInstance.patch(`/v1workspaces/${workspaceId}` , data);
        return response.data;
    }

    async deleteWorkspace(workspaceId:string) :Promise<DeleteWorkspaceResponse>{
        const response = await axiosInstance.delete(`/v1/workspace/${workspaceId}`);
        return response.data;
    }

    async updateWorkspaceLogo(workspaceId: string, logo : File) : Promise<UpdateWorkspaceLogoResponse>{
        const formData = new FormData();

        formData.append("logo",logo);

        const response  = await axiosInstance.patch(
            `/v1/workspaces/${workspaceId}/logo`,
            formData , 
            { headers : { 
                "Content-Type" : "multiport/form-data"
            }
        });

        return response.data;
    }
}

export const workspaceService = new WorkspaceService();