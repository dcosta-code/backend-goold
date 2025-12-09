import { employeeRepository } from "../repositories/employeeRepository";
import { EmployeeResponse, ListEmployeesQueryDTO } from "../types/employee";
import { Role, Permission } from "../models";

export const listEmployeesService = {
  async execute(query: ListEmployeesQueryDTO): Promise<EmployeeResponse[]> {
    const employees = await employeeRepository.findAllWithRolesAndPermissions(query.search);

    return employees.map((employee) => {
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
    });
  },
};
