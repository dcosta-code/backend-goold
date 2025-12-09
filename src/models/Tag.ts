import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/sequelize";

class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  declare id: CreationOptional<number>;
  declare externalId: string;
  declare name: string;
  declare backgroundColor: string;
  declare textColor: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Tag.init(
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
    backgroundColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      field: "background_color",
    },
    textColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      field: "text_color",
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
    tableName: "tags",
    timestamps: true,
    underscored: true,
  }
);

export { Tag };
