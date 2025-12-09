import { employeeRepository } from "../repositories/employeeRepository";
import { roleRepository } from "../repositories/roleRepository";
import { permissionRepository } from "../repositories/permissionRepository";
import { UpdateEmployeeDTO, EmployeeResponse } from "../types/employee";
import { passwordUtils } from "../utils/password";
import { AppError } from "../utils/AppError";
import { Role, Permission } from "../models";
import { sequelize } from "../config/sequelize";

export const updateEmployeeService = {
  async execute(
    externalId: string,
    data: UpdateEmployeeDTO
  ): Promise<EmployeeResponse> {
    const employee = await employeeRepository.findByExternalIdWithRoles(
      externalId
    );
    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    if (data.email) {
      const emailExists = await employeeRepository.existsByEmailExcludingId(
        data.email,
        employee.id
      );
      if (emailExists) {
        throw AppError.badRequest("Email already in use");
      }
    }

    let roleIds: number[] | undefined;
    if (data.roles && data.roles.length > 0) {
      const roles = await roleRepository.findByNames(data.roles);
      if (roles.length !== data.roles.length) {
        throw AppError.badRequest("One or more roles not found");
      }
      roleIds = roles.map((role) => role.id);
    }

    let permissionIds: number[] | undefined;
    if (data.permissions !== undefined) {
      if (data.permissions.length > 0) {
        const permissions = await permissionRepository.findByKeys(data.permissions);
        if (permissions.length !== data.permissions.length) {
          throw AppError.badRequest("One or more permissions not found");
        }
        permissionIds = permissions.map((permission) => permission.id);
      } else {
        permissionIds = [];
      }
    }

    const { roles: roleNames, permissions: permissionKeys, password, ...fields } = data;
    const updateData: Omit<UpdateEmployeeDTO, "roles" | "permissions"> = {
      ...Object.fromEntries(
        Object.entries(fields).filter(([, v]) => v !== undefined)
      ),
      ...(password && { password: await passwordUtils.hash(password) }),
    };

    await sequelize.transaction(async (transaction) => {
      if (Object.keys(updateData).length > 0) {
        await employeeRepository.update(employee.id, updateData, transaction);
      }

      if (roleIds && roleIds.length > 0) {
        await employeeRepository.setRoles(employee.id, roleIds, transaction);
      }

      if (permissionIds !== undefined) {
        await employeeRepository.setPermissions(employee.id, permissionIds, transaction);
      }
    });

    const updatedEmployee = await employeeRepository.findByIdWithRolesAndPermissions(
      employee.id
    );
    const employeeRoles = (updatedEmployee?.get("roles") as Role[]) || [];
    const employeePermissions = (updatedEmployee?.get("permissions") as Permission[]) || [];

    return {
      externalId: updatedEmployee!.externalId,
      email: updatedEmployee!.email,
      fullName: updatedEmployee!.fullName,
      isActive: updatedEmployee!.isActive,
      roles: employeeRoles.map((role) => role.name),
      permissions: employeePermissions.map((permission) => permission.key),
      createdAt: updatedEmployee!.createdAt,
      updatedAt: updatedEmployee!.updatedAt,
    };
  },
};
