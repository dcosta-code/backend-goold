import { customerRepository } from "../repositories/customerRepository";
import { AppError } from "../utils/AppError";

interface CustomerProfileResponse {
  externalId: string;
  cpf: string;
  fullName: string;
  email: string;
  phone: string;
}

export const getCustomerProfileService = {
  async execute(externalId: string): Promise<CustomerProfileResponse> {
    const customer = await customerRepository.findByExternalId(externalId);

    if (!customer) {
      throw AppError.notFound("Customer not found");
    }

    return {
      externalId: customer.externalId,
      cpf: customer.cpf,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
    };
  },
};
