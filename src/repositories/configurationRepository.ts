import { Configuration } from "../models/Configuration";

export const configurationRepository = {
  async findAll(): Promise<Configuration[]> {
    return Configuration.findAll({
      where: { isActive: true },
      order: [["ranking", "ASC"]],
    });
  },

  async findByExternalId(externalId: string): Promise<Configuration | null> {
    return Configuration.findOne({ where: { externalId } });
  },

  async findByCode(code: string): Promise<Configuration | null> {
    return Configuration.findOne({ where: { code } });
  },

  async updateSelected(id: number, selected: string[]): Promise<void> {
    await Configuration.update({ selected }, { where: { id } });
  },
};
