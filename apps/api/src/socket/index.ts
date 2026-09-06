import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { socketAuthenticate } from "./auth.js";
import { registerCommunicationHandlers } from "./communication.js";
import { env } from "../config/env.js";

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuthenticate);

  io.on("connection", (socket) => {
    const userId = socket.data.user._id;

    console.log(`socket connected: ${socket.id} | user: ${userId}`);

    /*
     * Every authenticated user gets a private room.
     *
     * Notification events can later be emitted to:
     * user:${userId}
     *
     * This keeps notifications isolated to the
     * intended recipient.
     */
    socket.join(`user:${userId}`);

    registerCommunicationHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
