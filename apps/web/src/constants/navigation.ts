import { CheckSquare, FolderKanban, LayoutDashboard, Mail, Settings, Users } from "lucide-react";


export const navigation = [
    {
        title : "Dashboard",
        href : "/dashboard",
        icon : LayoutDashboard
    },
    {
        title : "Projects",
        href : "/projects",
        icon : FolderKanban
    },
    {
        title : "Tasks",
        href : "/tasks",
        icon : CheckSquare
    },
    {
        title : "Members",
        href : "/members",
        icon : Users
    },
    {
        title : "Invitations",
        href : "/invitations",
        icon : Mail
    },
    {
        title : "Settings",
        href : "/settings",
        icon : Settings
    },

] as const;