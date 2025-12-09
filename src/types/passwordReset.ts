export interface ForgotPasswordDTO {
  email: string;
}

export interface VerifyCodeDTO {
  email: string;
  code: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface VerifyCodeResponse {
  token: string;
}

export interface OtpData {
  code: string;
  externalId: string;
}

export interface ResetTokenData {
  externalId: string;
}
