import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../config/sequelize";
import { Ticket } from "./Ticket";
import { SenderType } from "../types/message";

class Message extends Model<
  InferAttributes<Message>,
  InferCreationAttributes<Message>
> {
  declare id: CreationOptional<number>;
  declare externalId: string;
  declare ticketId: ForeignKey<Ticket["id"]>;
  declare senderType: SenderType;
  declare senderId: number;
  declare content: string;
  declare createdAt: CreationOptional<Date>;

  declare ticket?: NonAttribute<Ticket>;
}

Message.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    externalId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: true,
      field: "external_id",
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ticket_id",
    },
    senderType: {
      type: DataTypes.ENUM("customer", "employee"),
      allowNull: false,
      field: "sender_type",
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "sender_id",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "messages",
    timestamps: true,
    updatedAt: false,
    underscored: true,
  }
);

export { Message };
