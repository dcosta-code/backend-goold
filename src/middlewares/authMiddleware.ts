import { Request, Response, NextFunction } from "express";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { TokenPayload, UserType } from "../types/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        externalId: string;
        userType: UserType;
        roles?: string[];
      };
    }
  }
}

export const authMiddleware = {
  authenticate(req: Request, _res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw AppError.unauthorized("Invalid or expired token");
      }

      const [type, token] = authHeader.split(" ");

      if (type !== "Bearer" || !token) {
        throw AppError.unauthorized("Invalid or expired token");
      }

      const payload: TokenPayload = jwtUtils.verifyToken(token);

      if (payload.type !== "access") {
        throw AppError.unauthorized("Invalid or expired token");
      }

      req.user = {
        externalId: payload.sub,
        userType: payload.userType,
        roles: payload.roles,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(AppError.unauthorized("Invalid or expired token"));
      }
    }
  },

  authenticateCustomer(req: Request, _res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw AppError.unauthorized("Invalid or expired token");
      }

      const [type, token] = authHeader.split(" ");

      if (type !== "Bearer" || !token) {
        throw AppError.unauthorized("Invalid or expired token");
      }

      const payload: TokenPayload = jwtUtils.verifyToken(token);

      if (payload.type !== "access") {
        throw AppError.unauthorized("Invalid or expired token");
      }

      if (payload.userType !== "customer") {
        throw AppError.unauthorized("Invalid or expired token");
      }

      req.user = {
        externalId: payload.sub,
        userType: payload.userType,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(AppError.unauthorized("Invalid or expired token"));
      }
    }
  },

  authenticateEmployee(req: Request, _res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw AppError.unauthorized("Invalid or expired token");
      }

      const [type, token] = authHeader.split(" ");

      if (type !== "Bearer" || !token) {
        throw AppError.unauthorized("Invalid or expired token");
      }

      const payload: TokenPayload = jwtUtils.verifyToken(token);

      if (payload.type !== "access") {
        throw AppError.unauthorized("Invalid or expired token");
      }

      if (payload.userType !== "employee") {
        throw AppError.unauthorized("Invalid or expired token");
      }

      req.user = {
        externalId: payload.sub,
        userType: payload.userType,
        roles: payload.roles,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(AppError.unauthorized("Invalid or expired token"));
      }
    }
  },
};
