import { Server, Socket } from "socket.io";

import { communicationService } from "../modules/communication/service.js";

interface SendMessagePayload {
  conversationId: string;
  content: string;
}

interface SocketAck<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export const registerCommunicationHandlers = (io: Server, socket: Socket) => {
  /*
   * Join conversation
   */

  socket.on("conversation:join", async (conversationId: string) => {
    try {
      if (!conversationId) {
        socket.emit("conversation:error", {
          message: "Conversation ID is required.",
        });

        return;
      }

      await communicationService.getConversation(
        conversationId,
        socket.data.user._id,
      );

      await socket.join(`conversation:${conversationId}`);

      socket.emit("conversation:joined", {
        conversationId,
      });
    } catch (error) {
      console.error("Failed to join conversation:", error);

      socket.emit("conversation:error", {
        message:
          error instanceof Error
            ? error.message
            : "Unable to join conversation.",
      });
    }
  });

  /*
   * Send message
   */

  socket.on(
    "message:send",
    async (
      payload: SendMessagePayload,
      ack?: (response: SocketAck) => void,
    ) => {
      try {
        const { conversationId, content } = payload;

        const message = await communicationService.createMessage(
          conversationId,
          socket.data.user._id,
          content,
        );

        io.to(`conversation:${conversationId}`).emit("message:new", message);

        ack?.({
          success: true,
          data: message,
        });
      } catch (error) {
        console.error("Failed to send message:", error);

        ack?.({
          success: false,
          message:
            error instanceof Error ? error.message : "Unable to send message.",
        });
      }
    },
  );
};
