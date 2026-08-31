"use client";

import { MessageCircle, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConversationList } from "@/components/communication/ConversationList";
import { ChatWindow } from "@/components/communication/ChatWindow";
import { NewConversationDialog } from "@/components/communication/NewConversationDialog";
import { useCommunication } from "@/hooks/communication/useCommunication";

export default function CommunicationPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

  const { conversations, conversationsQuery } = useCommunication();

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6" />

          <div>
            <h1 className="text-xl font-semibold">Communication</h1>

            <p className="text-sm text-muted-foreground">
              Connect and collaborate with your team.
            </p>
          </div>
        </div>
      </div>

      {/* Communication Layout */}
      <div className="flex min-h-0 flex-1">
        {/* Conversations Sidebar */}
        <aside className="w-80 shrink-0 border-r">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-sm font-semibold">Conversations</h2>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewConversationOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {conversationsQuery.isLoading ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Loading conversations...
              </p>
            </div>
          ) : conversationsQuery.isError ? (
            <div className="p-4">
              <p className="text-sm text-destructive">
                Unable to load conversations.
              </p>
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelect={setSelectedConversationId}
            />
          )}
        </aside>

        {/* Chat Window */}
        <ChatWindow conversationId={selectedConversationId} />
      </div>

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
        onConversationCreated={(conversationId) => {
          setSelectedConversationId(conversationId);
        }}
      />
    </div>
  );
}
