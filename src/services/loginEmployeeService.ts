import { employeeRepository } from "../repositories/employeeRepository";
import { EmployeeLoginDTO, TokenResponse } from "../types/auth";
import { passwordUtils } from "../utils/password";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { Role } from "../models";

export const loginEmployeeService = {
  async execute(data: EmployeeLoginDTO): Promise<TokenResponse> {
    const employee = await employeeRepository.findByEmailWithRoles(data.email);

    if (!employee) {
      throw AppError.unauthorized("Invalid credentials");
    }

    if (!employee.isActive) {
      throw AppError.unauthorized("Account is inactive");
    }

    const isPasswordValid = await passwordUtils.compare(
      data.password,
      employee.password
    );

    if (!isPasswordValid) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const roles = (employee.get("roles") as Role[]) || [];
    const roleNames = roles.map((role) => role.name);

    const accessToken = jwtUtils.generateAccessToken(
      employee.externalId,
      "employee",
      roleNames
    );
    const refreshToken = jwtUtils.generateRefreshToken(
      employee.externalId,
      "employee"
    );

    return {
      accessToken,
      refreshToken,
    };
  },
};
