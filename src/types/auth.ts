export type UserType = "customer" | "employee";

export interface LoginDTO {
  cpf: string;
  password: string;
}

export interface EmployeeLoginDTO {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  type: "access" | "refresh";
  userType: UserType;
  roles?: string[];
  iat?: number;
  exp?: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}
