import { Employee, Role, EmployeeRole, EmployeePermission, Permission } from "../models";
import { Op, Transaction } from "sequelize";
import { UpdateEmployeeDTO } from "../types/employee";

interface CreateEmployeeData {
  externalId: string;
  email: string;
  password: string;
  fullName: string;
}

type UpdateEmployeeData = Omit<UpdateEmployeeDTO, "roleIds">;

export const employeeRepository = {
  async create(
    data: CreateEmployeeData,
    transaction?: Transaction
  ): Promise<Employee> {
    return Employee.create(data, { transaction });
  },

  async findByEmailWithRoles(email: string): Promise<Employee | null> {
    return Employee.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });
  },

  async findByExternalIdWithRoles(externalId: string): Promise<Employee | null> {
    return Employee.findOne({
      where: { externalId },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });
  },

  async findByExternalIdWithRolesAndPermissions(externalId: string): Promise<Employee | null> {
    return Employee.findOne({
      where: { externalId },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
    });
  },

  async findByIdWithRoles(id: number): Promise<Employee | null> {
    return Employee.findByPk(id, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });
  },

  async existsByEmail(email: string): Promise<boolean> {
    const count = await Employee.count({ where: { email } });
    return count > 0;
  },

  async setRoles(
    employeeId: number,
    roleIds: number[],
    transaction?: Transaction
  ): Promise<void> {
    await EmployeeRole.destroy({ where: { employeeId }, transaction });
    const employeeRoles = roleIds.map((roleId) => ({ employeeId, roleId }));
    await EmployeeRole.bulkCreate(employeeRoles, { transaction });
  },

  async update(
    id: number,
    data: UpdateEmployeeData,
    transaction?: Transaction
  ): Promise<void> {
    await Employee.update(data, { where: { id }, transaction });
  },

  async existsByEmailExcludingId(
    email: string,
    excludeId: number
  ): Promise<boolean> {
    const count = await Employee.count({
      where: {
        email,
        id: { [Op.ne]: excludeId },
      },
    });
    return count > 0;
  },

  async findAllWithRoles(search?: string): Promise<Employee[]> {
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause[Op.or as unknown as string] = [
        { email: { [Op.like]: `%${search}%` } },
        { fullName: { [Op.like]: `%${search}%` } },
        { "$roles.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    return Employee.findAll({
      where: whereClause,
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },

  async findAllWithRolesAndPermissions(search?: string): Promise<Employee[]> {
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause[Op.or as unknown as string] = [
        { email: { [Op.like]: `%${search}%` } },
        { fullName: { [Op.like]: `%${search}%` } },
        { "$roles.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    return Employee.findAll({
      where: whereClause,
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },

  async delete(id: number): Promise<void> {
    await EmployeeRole.destroy({ where: { employeeId: id } });
    await EmployeePermission.destroy({ where: { employeeId: id } });
    await Employee.destroy({ where: { id } });
  },

  async setPermissions(
    employeeId: number,
    permissionIds: number[],
    transaction?: Transaction
  ): Promise<void> {
    await EmployeePermission.destroy({ where: { employeeId }, transaction });
    if (permissionIds.length > 0) {
      const employeePermissions = permissionIds.map((permissionId) => ({
        employeeId,
        permissionId,
      }));
      await EmployeePermission.bulkCreate(employeePermissions, { transaction });
    }
  },

  async findByIdWithRolesAndPermissions(id: number): Promise<Employee | null> {
    return Employee.findByPk(id, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
    });
  },

  async findActiveByRoleName(roleName: string): Promise<Employee[]> {
    return Employee.findAll({
      where: { isActive: true },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: roleName },
          through: { attributes: [] },
        },
      ],
    });
  },
};
