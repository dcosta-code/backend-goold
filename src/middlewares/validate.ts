import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { AppError } from "../utils/AppError";

export const validate = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    console.log(req.body);
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      throw AppError.badRequest(messages);
    }

    req.body = value;
    next();
  };
};
