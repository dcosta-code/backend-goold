import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize";
import { TicketStatus } from "./TicketStatus";
import { Customer } from "./Customer";
import { Employee } from "./Employee";
import { Tag } from "./Tag";

class Ticket extends Model<
  InferAttributes<Ticket>,
  InferCreationAttributes<Ticket>
> {
  declare id: CreationOptional<number>;
  declare externalId: string;
  declare statusId: ForeignKey<TicketStatus["id"]>;
  declare customerId: ForeignKey<Customer["id"]>;
  declare startedEmployeeId: ForeignKey<Employee["id"]>;
  declare assignedEmployeeId: ForeignKey<Employee["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare status?: NonAttribute<TicketStatus>;
  declare customer?: NonAttribute<Customer>;
  declare startedEmployee?: NonAttribute<Employee>;
  declare assignedEmployee?: NonAttribute<Employee>;
  declare tags?: NonAttribute<Tag[]>;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    externalId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: true,
      field: "external_id",
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status_id",
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "customer_id",
    },
    startedEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "started_employee_id",
    },
    assignedEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assigned_employee_id",
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
    sequelize,
    tableName: "tickets",
    timestamps: true,
    underscored: true,
  }
);

export { Ticket };
