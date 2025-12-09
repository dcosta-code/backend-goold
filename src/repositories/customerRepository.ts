import { Customer } from "../models/Customer";

interface CreateCustomerData {
  externalId: string;
  cpf: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
}

interface UpdateCustomerData {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export const customerRepository = {
  async create(data: CreateCustomerData): Promise<Customer> {
    return Customer.create(data);
  },

  async findByCpf(cpf: string): Promise<Customer | null> {
    return Customer.findOne({ where: { cpf } });
  },

  async findByExternalId(externalId: string): Promise<Customer | null> {
    return Customer.findOne({ where: { externalId } });
  },

  async existsByCpf(cpf: string): Promise<boolean> {
    const count = await Customer.count({ where: { cpf } });
    return count > 0;
  },

  async existsByEmail(email: string): Promise<boolean> {
    const count = await Customer.count({ where: { email } });
    return count > 0;
  },

  async findByEmail(email: string): Promise<Customer | null> {
    return Customer.findOne({ where: { email } });
  },

  async updatePassword(id: number, password: string): Promise<void> {
    await Customer.update({ password }, { where: { id } });
  },

  async update(id: number, data: UpdateCustomerData): Promise<void> {
    await Customer.update(data, { where: { id } });
  },

  async existsByEmailExcludingId(email: string, excludeId: number): Promise<boolean> {
    const { Op } = await import("sequelize");
    const count = await Customer.count({
      where: {
        email,
        id: { [Op.ne]: excludeId },
      },
    });
    return count > 0;
  },
};
