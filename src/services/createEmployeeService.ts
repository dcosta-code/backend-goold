import { employeeRepository } from "../repositories/employeeRepository";
import { roleRepository } from "../repositories/roleRepository";
import { permissionRepository } from "../repositories/permissionRepository";
import { CreateEmployeeDTO, EmployeeResponse } from "../types/employee";
import { passwordUtils } from "../utils/password";
import { AppError } from "../utils/AppError";
import { v4 as uuidv4 } from "uuid";
import { Role, Permission } from "../models";
import { sequelize } from "../config/sequelize";

export const createEmployeeService = {
  async execute(data: CreateEmployeeDTO): Promise<EmployeeResponse> {
    const existingEmployee = await employeeRepository.existsByEmail(data.email);
    if (existingEmployee) {
      throw AppError.badRequest("Email already in use");
    }

    const roles = await roleRepository.findByNames(data.roles);
    if (roles.length !== data.roles.length) {
      throw AppError.badRequest("One or more roles not found");
    }

    let permissionIds: number[] = [];
    if (data.permissions && data.permissions.length > 0) {
      const permissions = await permissionRepository.findByKeys(data.permissions);
      if (permissions.length !== data.permissions.length) {
        throw AppError.badRequest("One or more permissions not found");
      }
      permissionIds = permissions.map((permission) => permission.id);
    }

    const roleIds = roles.map((role) => role.id);
    const hashedPassword = await passwordUtils.hash(data.password);
    const externalId = uuidv4();

    const employee = await sequelize.transaction(async (transaction) => {
      const newEmployee = await employeeRepository.create(
        {
          externalId,
          email: data.email,
          password: hashedPassword,
          fullName: data.fullName,
        },
        transaction
      );

      await employeeRepository.setRoles(newEmployee.id, roleIds, transaction);

      if (permissionIds.length > 0) {
        await employeeRepository.setPermissions(newEmployee.id, permissionIds, transaction);
      }

      return newEmployee;
    });

    const employeeWithRolesAndPermissions = await employeeRepository.findByIdWithRolesAndPermissions(
      employee.id
    );
    const employeeRoles = (employeeWithRolesAndPermissions?.get("roles") as Role[]) || [];
    const employeePermissions = (employeeWithRolesAndPermissions?.get("permissions") as Permission[]) || [];

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
