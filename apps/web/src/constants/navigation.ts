import {
  Building2,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Users,
  FolderKanban,
  Mail,
} from "lucide-react";

export const globalNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Workspaces",
    href: "/dashboard/workspaces",
    icon: Building2,
  },

  {
    title: "My Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },

  {
    title: "Invitations",
    href: "/dashboard/invitations",
    icon: Mail,
  },

  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

export const workspaceNavigation = [
  {
    title: "Overview",
    href: "",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },

  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },

  {
    title: "Members",
    href: "/members",
    icon: Users,
  },

  {
    title: "Invitations",
    href: "/invitations",
    icon: Mail,
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
] as const;
