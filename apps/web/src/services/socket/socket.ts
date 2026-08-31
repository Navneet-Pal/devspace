import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

let socket: Socket | null = null;

export const connectSocket = (accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  /*
   * Reuse existing socket.
   */
  if (socket) {
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    withCredentials: true,
    autoConnect: true,
  });

  /*
   * Socket connected
   */

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  /*
   * Connection error
   *
   * Socket.IO may temporarily lose connection
   * and automatically retry. Keep this as a
   * warning instead of an application error.
   */

  socket.on("connect_error", (error) => {
    console.warn("Socket connection error:", error.message);
  });

  /*
   * Socket disconnected
   */

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

/*
 * Get current socket instance
 */

export const getSocket = () => {
  return socket;
};

/*
 * Join conversation room
 */

export const joinConversation = (conversationId: string) => {
  if (!socket?.connected) {
    console.warn("Cannot join conversation: socket is not connected.");

    return;
  }

  socket.emit("conversation:join", conversationId);
};

/*
 * Disconnect socket
 */

export const disconnectSocket = () => {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
};
