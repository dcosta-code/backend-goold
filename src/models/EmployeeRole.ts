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
import { Role } from "./Role";

class EmployeeRole extends Model<
  InferAttributes<EmployeeRole>,
  InferCreationAttributes<EmployeeRole>
> {
  declare id: CreationOptional<number>;
  declare employeeId: ForeignKey<Employee["id"]>;
  declare roleId: ForeignKey<Role["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EmployeeRole.init(
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
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "role_id",
      references: {
        model: "roles",
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
    tableName: "employee_roles",
    timestamps: true,
    underscored: true,
  }
);

export { EmployeeRole };
