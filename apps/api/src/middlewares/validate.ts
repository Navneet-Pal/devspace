import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { StatusCode } from "../constants/statusCode.js";

export const validate = (schema: ZodSchema) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(
            StatusCode.BAD_REQUEST,
            error.issues[0]?.message || "Validation failed."
          )
        );
      }

      next(error);
    }
  };
};