import { Role } from "../models";

export const roleRepository = {
  async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name } });
  },

  async findByIds(ids: number[]): Promise<Role[]> {
    return Role.findAll({ where: { id: ids } });
  },

  async findByNames(names: string[]): Promise<Role[]> {
    return Role.findAll({ where: { name: names } });
  },
};
