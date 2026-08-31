import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { socketAuthenticate } from "./auth.js";
import { registerCommunicationHandlers } from "./communication.js";

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use(socketAuthenticate);

  io.on("connection", (socket) => {
    const userId = socket.data.user._id;

    console.log(`socket connected: ${socket.id} | user: ${userId}`);

    registerCommunicationHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
