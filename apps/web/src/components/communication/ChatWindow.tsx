"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { MessageInput } from "./MessageInput";

import { useCommunication } from "@/hooks/communication/useCommunication";
import { getSocket, joinConversation } from "@/services/socket/socket";
import { communicationKeys } from "@/services/communication/keys";
import { useAuthStore } from "@/store/auth";

import type { Message } from "@/services/communication/types";

interface ChatWindowProps {
  conversationId: string | null;
}

export const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversation, messages, conversationQuery, messagesQuery } =
    useCommunication(conversationId);

  /*
   * Get other participant for direct conversation
   */

  const otherParticipant =
    conversation?.type === "DIRECT"
      ? conversation.participants.find(
          (participant) => participant._id !== user?._id,
        )
      : null;

  const conversationTitle =
    conversation?.type === "DIRECT"
      ? (otherParticipant?.name ?? "Unknown User")
      : (conversation?.name ?? "Group Conversation");

  const conversationSubtitle =
    conversation?.type === "DIRECT"
      ? (otherParticipant?.email ?? "Direct message")
      : `${conversation?.participants.length ?? 0} participants`;

  /*
   * Join conversation + listen for real-time messages
   */

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const socket = getSocket();

    if (!socket) {
      return;
    }

    joinConversation(conversationId);

    const handleNewMessage = (message: Message) => {
      if (message.conversationId !== conversationId) {
        return;
      }

      queryClient.setQueryData<Message[]>(
        communicationKeys.messages(conversationId),
        (currentMessages = []) => {
          const alreadyExists = currentMessages.some(
            (existingMessage) => existingMessage._id === message._id,
          );

          if (alreadyExists) {
            return currentMessages;
          }

          return [...currentMessages, message];
        },
      );

      queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [conversationId, queryClient]);

  /*
   * Auto scroll
   */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  /*
   * No conversation selected
   */

  if (!conversationId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

          <h2 className="text-lg font-semibold">Select a conversation</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose a conversation to start chatting.
          </p>
        </div>
      </div>
    );
  }

  /*
   * Loading
   */

  if (conversationQuery.isLoading || messagesQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  /*
   * Conversation not found
   */

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Conversation not found.</p>
      </div>
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      {/* Header */}

      <div className="flex items-center gap-3 border-b px-6 py-4">
        {/* Avatar */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {conversation.type === "DIRECT" && otherParticipant?.avatar ? (
            <img
              src={otherParticipant.avatar}
              alt={otherParticipant.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </div>

        {/* Name + subtitle */}

        <div className="min-w-0">
          <h2 className="truncate font-semibold">{conversationTitle}</h2>

          <p className="truncate text-xs text-muted-foreground">
            {conversationSubtitle}
          </p>
        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No messages yet. Start the conversation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              /*
               * senderId is now a populated user object
               */

              const isOwnMessage = message.senderId._id === user?._id;

              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[70%] items-end gap-2 ${
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Sender Avatar - Group messages only */}

                    {conversation.type === "GROUP" && !isOwnMessage && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                        {message.senderId.avatar ? (
                          <img
                            src={message.senderId.avatar}
                            alt={message.senderId.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium">
                            {message.senderId.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className={`min-w-0 rounded-2xl px-4 py-2.5 ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {/* Sender Name */}

                      {conversation.type === "GROUP" && !isOwnMessage && (
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">
                          {message.senderId.name}
                        </p>
                      )}

                      {/* Message */}

                      <p className="whitespace-pre-wrap break-words text-sm">
                        {message.content}
                      </p>

                      {/* Time */}

                      <p
                        className={`mt-1 text-[11px] ${
                          isOwnMessage
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}

      <MessageInput conversationId={conversationId} />
    </main>
  );
};
