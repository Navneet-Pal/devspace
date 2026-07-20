import { WorkspaceResponseDTO } from "./dto/responseWorkspace.js";
import { IWorkspace } from "./types.js";


export class WorkspaceMapper {
    static toResponse(
        workspace: IWorkspace
    ): WorkspaceResponseDTO {
        return {
            id: workspace._id.toString(),
            name: workspace.name,
            description: workspace.description ?? "",
            logo: workspace.logo ?? "",
        };
    }
}