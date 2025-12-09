import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    name: process.env.DB_NAME || "database",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET as string,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY as string,
    emailFrom: process.env.EMAIL_FROM as string,
  },

  passwordReset: {
    otpTtl: parseInt(process.env.OTP_TTL || "900", 10),
    resetTokenTtl: parseInt(process.env.RESET_TOKEN_TTL || "1800", 10),
  },

  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};
