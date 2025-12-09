import { customerRepository } from "../repositories/customerRepository";
import { RefreshTokenDTO, AccessTokenResponse } from "../types/auth";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const refreshTokenService = {
  async execute(data: RefreshTokenDTO): Promise<AccessTokenResponse> {
    try {
      const payload = jwtUtils.verifyToken(data.refreshToken);

      if (payload.type !== "refresh") {
        throw AppError.unauthorized("Invalid token type");
      }

      if (payload.userType !== "customer") {
        throw AppError.unauthorized("Invalid token type");
      }

      const customer = await customerRepository.findByExternalId(payload.sub);
      if (!customer) {
        throw AppError.unauthorized("Customer not found");
      }

      const accessToken = jwtUtils.generateAccessToken(customer.externalId, "customer");

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.unauthorized("Invalid or expired refresh token");
    }
  },
};
