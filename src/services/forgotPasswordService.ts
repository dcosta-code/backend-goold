import { authenticator } from "otplib";
import { redis } from "../config/redis";
import { resend } from "../config/resend";
import { customerRepository } from "../repositories/customerRepository";
import { env } from "../config/env";
import { OtpData } from "../types";
import { AppError } from "../utils/AppError";

interface ForgotPasswordResult {
  maskedEmail: string;
  code?: string;
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  const length = localPart.length;

  if (length <= 1) {
    return `*@${domain}`;
  }

  const charsToMask = Math.max(1, Math.ceil(length * 0.3));
  const startMask = Math.floor((length - charsToMask) / 2);
  const endMask = startMask + charsToMask;

  const maskedLocal =
    localPart.substring(0, startMask) +
    "*".repeat(charsToMask) +
    localPart.substring(endMask);

  return `${maskedLocal}@${domain}`;
}

export const forgotPasswordService = {
  async execute(cpf: string): Promise<ForgotPasswordResult> {
    const customer = await customerRepository.findByCpf(cpf);
    if (!customer) {
      throw AppError.notFound("CPF not found", "CPF_NOT_FOUND");
    }

    const secret = authenticator.generateSecret();
    const code = authenticator.generate(secret);

    const otpData: OtpData = {
      code,
      externalId: customer.externalId,
    };

    await redis.set(
      `otp:${cpf}`,
      JSON.stringify(otpData),
      "EX",
      env.passwordReset.otpTtl
    );

    await resend.emails.send({
      from: env.resend.emailFrom,
      to: customer.email,
      subject: "Goold - Recuperação de senha",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Recuperação de senha</h2>
        <p>Você solicitou a recuperação da senha da sua conta.</p>
        <p>Seu código de verificação é:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">${code}</span>
        </div>
        <p>Este código expira em <strong>30 minutos</strong>.</p>
        <p>Se você não solicitou a recuperação de senha, pode ignorar este e-mail com segurança.</p>
      </div>
      `,
    });

    const maskedEmail = maskEmail(customer.email);

    if (env.isDevelopment) {
      return { maskedEmail, code };
    }

    return { maskedEmail };
  },
};
