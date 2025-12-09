import { Tag } from "../models/Tag";
import { Transaction, Op } from "sequelize";

export const tagRepository = {
  async findAll(): Promise<Tag[]> {
    return Tag.findAll({
      order: [["name", "ASC"]],
    });
  },

  async findByExternalId(externalId: string): Promise<Tag | null> {
    return Tag.findOne({ where: { externalId } });
  },

  async findByName(name: string): Promise<Tag | null> {
    return Tag.findOne({ where: { name } });
  },

  async existsByNameExcludingId(
    name: string,
    excludeId: number
  ): Promise<boolean> {
    const count = await Tag.count({
      where: { name, id: { [Op.ne]: excludeId } },
    });
    return count > 0;
  },

  async create(
    data: {
      externalId: string;
      name: string;
      backgroundColor: string;
      textColor: string;
    },
    transaction?: Transaction
  ): Promise<Tag> {
    return Tag.create(data, { transaction });
  },

  async update(
    id: number,
    data: {
      name: string;
      backgroundColor: string;
      textColor: string;
    },
    transaction?: Transaction
  ): Promise<void> {
    await Tag.update(data, { where: { id }, transaction });
  },

  async deleteByIds(ids: number[], transaction?: Transaction): Promise<void> {
    await Tag.destroy({ where: { id: ids }, transaction });
  },

  async findByExternalIds(externalIds: string[]): Promise<Tag[]> {
    return Tag.findAll({
      where: { externalId: externalIds },
    });
  },
};
