import type { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export const initializeNotificationSocket = (socketServer: SocketIOServer) => {
  io = socketServer;
};

export const emitNotification = (userId: string, notification: unknown) => {
  if (!io) {
    return;
  }

  io.to(`user:${userId}`).emit("notification:new", notification);
};
