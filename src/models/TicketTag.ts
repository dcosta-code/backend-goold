import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize";
import { Ticket } from "./Ticket";
import { Tag } from "./Tag";

class TicketTag extends Model<
  InferAttributes<TicketTag>,
  InferCreationAttributes<TicketTag>
> {
  declare id: CreationOptional<number>;
  declare ticketId: ForeignKey<Ticket["id"]>;
  declare tagId: ForeignKey<Tag["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TicketTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ticket_id",
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "tag_id",
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
    tableName: "ticket_tags",
    timestamps: true,
    underscored: true,
  }
);

export { TicketTag };
