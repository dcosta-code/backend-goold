import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize";

class MessageTemplate extends Model<
  InferAttributes<MessageTemplate>,
  InferCreationAttributes<MessageTemplate>
> {
  declare id: CreationOptional<number>;
  declare externalId: string;
  declare name: string;
  declare htmlContent: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MessageTemplate.init(
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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    htmlContent: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
      field: "html_content",
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
    tableName: "message_templates",
    timestamps: true,
    underscored: true,
  }
);

export { MessageTemplate };
