import { employeeRepository } from "../repositories/employeeRepository";
import { RefreshTokenDTO, AccessTokenResponse } from "../types/auth";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { Role } from "../models";

export const refreshEmployeeTokenService = {
  async execute(data: RefreshTokenDTO): Promise<AccessTokenResponse> {
    try {
      const payload = jwtUtils.verifyToken(data.refreshToken);

      if (payload.type !== "refresh") {
        throw AppError.unauthorized("Invalid token type");
      }

      if (payload.userType !== "employee") {
        throw AppError.unauthorized("Invalid token type");
      }

      const employee = await employeeRepository.findByExternalIdWithRoles(
        payload.sub
      );

      if (!employee) {
        throw AppError.unauthorized("Employee not found");
      }

      if (!employee.isActive) {
        throw AppError.unauthorized("Account is inactive");
      }

      const roles = (employee.get("roles") as Role[]) || [];
      const roleNames = roles.map((role) => role.name);

      const accessToken = jwtUtils.generateAccessToken(
        employee.externalId,
        "employee",
        roleNames
      );

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.unauthorized("Invalid or expired refresh token");
    }
  },
};
