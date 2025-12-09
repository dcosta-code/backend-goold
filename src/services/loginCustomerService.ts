import { customerRepository } from "../repositories/customerRepository";
import { LoginDTO, TokenResponse } from "../types/auth";
import { passwordUtils } from "../utils/password";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const loginCustomerService = {
  async execute(data: LoginDTO): Promise<TokenResponse> {
    const customer = await customerRepository.findByCpf(data.cpf);
    if (!customer) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const isPasswordValid = await passwordUtils.compare(
      data.password,
      customer.password
    );
    if (!isPasswordValid) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const accessToken = jwtUtils.generateAccessToken(customer.externalId, "customer");
    const refreshToken = jwtUtils.generateRefreshToken(customer.externalId, "customer");

    return {
      accessToken,
      refreshToken,
    };
  },
};
