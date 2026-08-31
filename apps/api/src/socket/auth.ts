import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

import { env } from "../config/env.js";
import { userRepository } from "../modules/user/respository.js";
import { IJwtPayload } from "../types/jwt.js";

interface SocketAuth {
  token?: string;
}

export const socketAuthenticate = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const auth = socket.handshake.auth as SocketAuth;

    if (!auth?.token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      auth.token,
      env.JWT_ACCESS_SECRET,
    ) as IJwtPayload;

    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.data.user = {
      _id: user._id.toString(),
      email: user.email,
    };

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
