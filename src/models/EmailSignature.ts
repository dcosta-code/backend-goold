import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize";

class EmailSignature extends Model<
  InferAttributes<EmailSignature>,
  InferCreationAttributes<EmailSignature>
> {
  declare id: CreationOptional<number>;
  declare externalId: string;
  declare htmlContent: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EmailSignature.init(
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
    tableName: "email_signatures",
    timestamps: true,
    underscored: true,
  }
);

export { EmailSignature };
