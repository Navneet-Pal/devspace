"use client";

import { MessageCircle, Users } from "lucide-react";

import { useAuthStore } from "@/store/auth";
import type { Conversation } from "@/services/communication/types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelect: (conversationId: string) => void;
}

export const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelect,
}: ConversationListProps) => {
  const currentUser = useAuthStore((state) => state.user);

  if (conversations.length === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.map((conversation) => {
        const isSelected = conversation._id === selectedConversationId;

        const otherParticipant =
          conversation.type === "DIRECT"
            ? conversation.participants.find(
                (participant) => participant._id !== currentUser?._id,
              )
            : null;

        const title =
          conversation.type === "DIRECT"
            ? (otherParticipant?.name ?? "Unknown User")
            : (conversation.name ?? "Group Conversation");

        const subtitle =
          conversation.type === "DIRECT"
            ? "Direct message"
            : `${conversation.participants.length} participants`;

        return (
          <button
            key={conversation._id}
            type="button"
            onClick={() => onSelect(conversation._id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
              isSelected ? "bg-accent" : "hover:bg-accent/50"
            }`}
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
              {conversation.type === "DIRECT" && otherParticipant?.avatar ? (
                <img
                  src={otherParticipant.avatar}
                  alt={otherParticipant.name}
                  className="h-full w-full object-cover"
                />
              ) : conversation.type === "GROUP" ? (
                <Users className="h-4 w-4" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
            </div>

            {/* Conversation info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{title}</p>

              <p className="truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
