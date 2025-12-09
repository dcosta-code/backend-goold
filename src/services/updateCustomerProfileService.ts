import { customerRepository } from "../repositories/customerRepository";
import { UpdateCustomerDTO, CustomerResponse } from "../types/customer";
import { passwordUtils } from "../utils/password";
import { AppError } from "../utils/AppError";

export const updateCustomerProfileService = {
  async execute(
    externalId: string,
    data: UpdateCustomerDTO
  ): Promise<CustomerResponse> {
    const customer = await customerRepository.findByExternalId(externalId);
    if (!customer) {
      throw AppError.notFound("Customer not found");
    }

    if (data.email) {
      const emailInUse = await customerRepository.existsByEmailExcludingId(
        data.email,
        customer.id
      );

      if (emailInUse) {
        throw AppError.conflict("Email already in use");
      }
    }

    const { password, ...fields } = data;

    const updateData: UpdateCustomerDTO = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined)
    );

    if (password) {
      updateData.password = await passwordUtils.hash(password);
    }

    await customerRepository.update(customer.id, updateData);

    const updatedCustomer = await customerRepository.findByExternalId(
      externalId
    );

    if (!updatedCustomer) {
      throw AppError.internal("Failed to retrieve updated customer");
    }

    return {
      externalId: updatedCustomer.externalId,
      cpf: updatedCustomer.cpf,
      fullName: updatedCustomer.fullName,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      createdAt: updatedCustomer.createdAt,
      updatedAt: updatedCustomer.updatedAt,
    };
  },
};
