import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize";
import { Employee } from "./Employee";
import { Permission } from "./Permission";

class EmployeePermission extends Model<
  InferAttributes<EmployeePermission>,
  InferCreationAttributes<EmployeePermission>
> {
  declare id: CreationOptional<number>;
  declare employeeId: ForeignKey<Employee["id"]>;
  declare permissionId: ForeignKey<Permission["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EmployeePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "employee_id",
      references: {
        model: "employees",
        key: "id",
      },
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "permission_id",
      references: {
        model: "permissions",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    sequelize: sequelize,
    tableName: "employee_permissions",
    timestamps: true,
    underscored: true,
  }
);

export { EmployeePermission };
