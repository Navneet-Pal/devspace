import { create } from "zustand";

interface WorkspaceState{
    currentWorkspaceId : string | null;
    setCurrentWorkspace : (workspaceId : string) => void;
    clearCurrentWorkspace : ()=> void;
}

export const useWorkspaceStore = create<WorkspaceState>(
    (set) => ({
        currentWorkspaceId : null,

        setCurrentWorkspace : (workspaceId) => set({ currentWorkspaceId : workspaceId}),

        clearCurrentWorkspace : ()=> set({ currentWorkspaceId : null }),
    })
);