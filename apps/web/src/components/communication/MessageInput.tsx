"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

import { getSocket } from "@/services/socket/socket";

interface MessageInputProps {
  conversationId: string;
}

interface SendMessageResponse {
  success: boolean;
  message?: string;
}

export const MessageInput = ({ conversationId }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || isSending) {
      return;
    }

    const socket = getSocket();

    if (!socket?.connected) {
      setError("Connection unavailable. Please try again.");

      return;
    }

    setError(null);
    setIsSending(true);

    socket.emit(
      "message:send",
      {
        conversationId,
        content: trimmedContent,
      },
      (response: SendMessageResponse) => {
        setIsSending(false);

        if (!response.success) {
          setError(response.message ?? "Unable to send message.");

          return;
        }

        setContent("");
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      {error && <p className="mb-2 text-xs text-destructive">{error}</p>}

      <div className="flex items-end gap-2">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Write a message..."
          rows={1}
          maxLength={5000}
          disabled={isSending}
          className="min-h-11 flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <button
          type="submit"
          disabled={!content.trim() || isSending}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
};
