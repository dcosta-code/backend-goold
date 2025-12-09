import { MessageTemplate } from "../models/MessageTemplate";
import { Transaction, Op } from "sequelize";

export const messageTemplateRepository = {
  async findAll(): Promise<MessageTemplate[]> {
    return MessageTemplate.findAll({
      order: [["name", "ASC"]],
    });
  },

  async findByExternalId(externalId: string): Promise<MessageTemplate | null> {
    return MessageTemplate.findOne({ where: { externalId } });
  },

  async findByName(name: string): Promise<MessageTemplate | null> {
    return MessageTemplate.findOne({ where: { name } });
  },

  async existsByNameExcludingId(
    name: string,
    excludeId: number
  ): Promise<boolean> {
    const count = await MessageTemplate.count({
      where: { name, id: { [Op.ne]: excludeId } },
    });
    return count > 0;
  },

  async create(
    data: {
      externalId: string;
      name: string;
      htmlContent: string;
    },
    transaction?: Transaction
  ): Promise<MessageTemplate> {
    return MessageTemplate.create(data, { transaction });
  },

  async update(
    id: number,
    data: {
      name: string;
      htmlContent: string;
    },
    transaction?: Transaction
  ): Promise<void> {
    await MessageTemplate.update(data, { where: { id }, transaction });
  },

  async deleteByIds(ids: number[], transaction?: Transaction): Promise<void> {
    await MessageTemplate.destroy({ where: { id: ids }, transaction });
  },

  async findByExternalIds(externalIds: string[]): Promise<MessageTemplate[]> {
    return MessageTemplate.findAll({
      where: { externalId: externalIds },
    });
  },
};
