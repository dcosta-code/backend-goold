import { employeeRepository } from "../repositories/employeeRepository";
import { EmployeeResponse } from "../types/employee";
import { AppError } from "../utils/AppError";
import { Role, Permission } from "../models";

export const getEmployeeService = {
  async execute(externalId: string): Promise<EmployeeResponse> {
    const employee = await employeeRepository.findByExternalIdWithRolesAndPermissions(externalId);
    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    const employeeRoles = (employee.get("roles") as Role[]) || [];
    const employeePermissions = (employee.get("permissions") as Permission[]) || [];

    return {
      externalId: employee.externalId,
      email: employee.email,
      fullName: employee.fullName,
      isActive: employee.isActive,
      roles: employeeRoles.map((role) => role.name),
      permissions: employeePermissions.map((permission) => permission.key),
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  },
};
