import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { TokenPayload, UserType } from "../types/auth";

export const jwtUtils = {
  generateAccessToken(
    externalId: string,
    userType: UserType,
    roles?: string[]
  ): string {
    const payload: TokenPayload = {
      sub: externalId,
      type: "access",
      userType,
      ...(roles && { roles }),
    };
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.accessTokenExpiresIn,
    } as jwt.SignOptions);
  },

  generateRefreshToken(externalId: string, userType: UserType): string {
    const payload: TokenPayload = {
      sub: externalId,
      type: "refresh",
      userType,
    };
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.refreshTokenExpiresIn,
    } as jwt.SignOptions);
  },

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.jwt.secret) as TokenPayload;
  },
};
