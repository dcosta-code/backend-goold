import { customerRepository } from "../repositories/customerRepository";
import { ticketRepository } from "../repositories/ticketRepository";
import { AppError } from "../utils/AppError";

interface HasActiveTicketDTO {
  customerExternalId: string;
}

interface HasActiveTicketResponse {
  hasActiveTicket: boolean;
}

export const hasActiveTicketService = {
  async execute(data: HasActiveTicketDTO): Promise<HasActiveTicketResponse> {
    const customer = await customerRepository.findByExternalId(
      data.customerExternalId
    );

    if (!customer) {
      throw AppError.notFound("Cliente não encontrado");
    }

    const hasActiveTicket = await ticketRepository.hasActiveTicketByCustomerId(
      customer.id
    );

    return { hasActiveTicket };
  },
};
