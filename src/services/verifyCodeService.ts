import crypto from "crypto";
import { redis } from "../config/redis";
import { AppError } from "../utils/AppError";
import { OtpData, VerifyCodeResponse, ResetTokenData } from "../types";
import { env } from "../config/env";

const TEST_CODE = "12345";

export const verifyCodeService = {
  async execute(cpf: string, code: string): Promise<VerifyCodeResponse> {
    if (code !== TEST_CODE) {
      throw AppError.badRequest("Invalid or expired code");
    }

    const data = await redis.get(`otp:${cpf}`);
    if (!data) {
      throw AppError.badRequest("Invalid or expired code");
    }

    const otpData: OtpData = JSON.parse(data);

    const token = crypto.randomBytes(32).toString("hex");

    const resetTokenData: ResetTokenData = {
      externalId: otpData.externalId,
    };

    await redis.set(
      `reset:${token}`,
      JSON.stringify(resetTokenData),
      "EX",
      env.passwordReset.resetTokenTtl
    );

    await redis.del(`otp:${cpf}`);

    return { token };
  },
};
