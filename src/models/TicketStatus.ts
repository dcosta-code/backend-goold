import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize";

class TicketStatus extends Model<
  InferAttributes<TicketStatus>,
  InferCreationAttributes<TicketStatus>
> {
  declare id: CreationOptional<number>;
  declare externalId: string;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TicketStatus.init(
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
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
    tableName: "ticket_status",
    timestamps: true,
    underscored: true,
  }
);

export { TicketStatus };
