import { redis } from "../config/redis";
import { customerRepository } from "../repositories/customerRepository";
import { passwordUtils } from "../utils/password";
import { AppError } from "../utils/AppError";
import { ResetTokenData } from "../types";

export const resetPasswordService = {
  async execute(token: string, newPassword: string): Promise<void> {
    const data = await redis.get(`reset:${token}`);
    if (!data) {
      throw AppError.badRequest("Invalid or expired token");
    }

    const resetTokenData: ResetTokenData = JSON.parse(data);
    const customer = await customerRepository.findByExternalId(
      resetTokenData.externalId
    );

    if (!customer) {
      throw AppError.badRequest("Invalid or expired token");
    }

    const hashedPassword = await passwordUtils.hash(newPassword);
    await customerRepository.updatePassword(customer.id, hashedPassword);

    await redis.del(`reset:${token}`);
  },
};
