import { ticketRepository } from "../repositories/ticketRepository";
import { ticketStatusRepository } from "../repositories/ticketStatusRepository";
import { TicketResponse } from "../types/ticket";
import { formatTicketResponse } from "./createTicketService";
import { AppError } from "../utils/AppError";

interface UpdateTicketStatusOptions {
  ticketExternalId: string;
  statusExternalId: string;
}

export const updateTicketStatusService = {
  async execute(options: UpdateTicketStatusOptions): Promise<TicketResponse> {
    const { ticketExternalId, statusExternalId } = options;

    const ticket = await ticketRepository.findByExternalId(ticketExternalId);
    if (!ticket) {
      throw AppError.notFound("Ticket not found");
    }

    const status = await ticketStatusRepository.findByExternalId(statusExternalId);
    if (!status) {
      throw AppError.notFound("Status not found");
    }

    await ticketRepository.update(ticket.id, {
      statusId: status.id,
    });

    const updatedTicket = await ticketRepository.findByExternalId(ticketExternalId);
    if (!updatedTicket) {
      throw AppError.badRequest("Error retrieving updated ticket");
    }

    return formatTicketResponse(updatedTicket);
  },
};
