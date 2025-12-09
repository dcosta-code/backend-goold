import { Permission, RolePermission, EmployeePermission } from "../models";
import { Op } from "sequelize";

export const permissionRepository = {
  async findByRoleIds(roleIds: number[]): Promise<Permission[]> {
    const rolePermissions = await RolePermission.findAll({
      where: { roleId: { [Op.in]: roleIds } },
      attributes: ["permissionId"],
    });

    const permissionIds = [
      ...new Set(rolePermissions.map((rp) => rp.permissionId)),
    ];

    if (permissionIds.length === 0) {
      return [];
    }

    return Permission.findAll({
      where: { id: { [Op.in]: permissionIds } },
    });
  },

  async findByEmployeeId(employeeId: number): Promise<Permission[]> {
    const employeePermissions = await EmployeePermission.findAll({
      where: { employeeId },
      attributes: ["permissionId"],
    });

    const permissionIds = [
      ...new Set(employeePermissions.map((ep) => ep.permissionId)),
    ];

    if (permissionIds.length === 0) {
      return [];
    }

    return Permission.findAll({
      where: { id: { [Op.in]: permissionIds } },
    });
  },

  async findByKeys(keys: string[]): Promise<Permission[]> {
    return Permission.findAll({
      where: { key: { [Op.in]: keys } },
    });
  },
};
