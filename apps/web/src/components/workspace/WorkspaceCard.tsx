"use client";

import { ArrowRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceStore } from "@/store/workspace";

interface WorkspaceCardProps {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export const WorkspaceCard = ({
  id,
  name,
  description,
  logo,
}: WorkspaceCardProps) => {
  const router = useRouter();
  
  const setCurrentWorkspace = useWorkspaceStore( (state) => state.setCurrentWorkspace );

  const handleSelect =()=>{
    setCurrentWorkspace(id);
    router.push(`/dashboard?workspace=${id}`);
  }

  return (
    <Card
      onClick={handleSelect}
      className="group cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-lg"
    >
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <Avatar className="h-12 w-12 rounded-xl">
            <AvatarImage src={logo} alt={name} />

            <AvatarFallback className="rounded-xl text-base font-semibold">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="rounded-lg bg-muted p-2">
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{name}</h3>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description || "No description provided."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
