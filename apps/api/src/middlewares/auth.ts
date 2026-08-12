import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../types/jwt.js";
import { UserRespository } from "../modules/user/respository.js";

const userRespository = new UserRespository();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = header.split(" ")[1];

  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as IJwtPayload;

  const user = await userRespository.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  req.user = {
    _id: user._id,
    email: user.email,
  };
  next();
};
