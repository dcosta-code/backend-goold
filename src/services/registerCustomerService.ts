import { v4 as uuidv4 } from "uuid";
import { customerRepository } from "../repositories/customerRepository";
import { CreateCustomerDTO, CustomerResponse } from "../types/customer";
import { passwordUtils } from "../utils/password";
import { AppError } from "../utils/AppError";

export const registerCustomerService = {
  async execute(data: CreateCustomerDTO): Promise<CustomerResponse> {
    const cpfExists = await customerRepository.existsByCpf(data.cpf);
    if (cpfExists) {
      throw AppError.badRequest("CPF already registered");
    }

    const emailExists = await customerRepository.existsByEmail(data.email);
    if (emailExists) {
      throw AppError.badRequest("Email already registered");
    }

    const hashedPassword = await passwordUtils.hash(data.password);
    const externalId = uuidv4();

    const customer = await customerRepository.create({
      externalId,
      cpf: data.cpf,
      password: hashedPassword,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    });

    return {
      externalId: customer.externalId,
      cpf: customer.cpf,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  },
};
