import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { jwtUtils } from "../utils/jwt";
import { TokenPayload, UserType } from "../types/auth";

export interface SocketUser {
  externalId: string;
  userType: UserType;
  roles?: string[];
}

declare module "socket.io" {
  interface Socket {
    user: SocketUser;
  }
}

export const socketAuth = (
  socket: Socket,
  next: (err?: ExtendedError) => void
): void => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const payload: TokenPayload = jwtUtils.verifyToken(token);

    if (payload.type !== "access") {
      return next(new Error("Invalid token type"));
    }

    socket.user = {
      externalId: payload.sub,
      userType: payload.userType,
      roles: payload.roles,
    };

    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
};
