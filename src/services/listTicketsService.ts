import { ticketRepository } from "../repositories/ticketRepository";
import { ticketStatusRepository } from "../repositories/ticketStatusRepository";
import { customerRepository } from "../repositories/customerRepository";
import { employeeRepository } from "../repositories/employeeRepository";
import { messageRepository } from "../repositories/messageRepository";
import { TicketListResponse } from "../types/ticket";
import { formatTicketResponse } from "./createTicketService";
import { AppError } from "../utils/AppError";
import { Ticket } from "../models/Ticket";

interface ListTicketsOptions {
  userExternalId: string;
  userType: "customer" | "employee";
  roles?: string[];
  status?: string;
  limit?: number;
  offset?: number;
}

export const listTicketsService = {
  async execute(options: ListTicketsOptions): Promise<TicketListResponse> {
    const { userExternalId, userType, roles, status, limit = 20, offset = 0 } = options;

    let customerId: number | undefined;
    let assignedEmployeeId: number | undefined;
    let statusId: number | undefined;

    if (status) {
      const ticketStatus = await ticketStatusRepository.findByName(status);
      if (!ticketStatus) {
        throw AppError.badRequest(`Invalid status: ${status}`);
      }
      statusId = ticketStatus.id;
    }

    if (userType === "customer") {
      const customer = await customerRepository.findByExternalId(userExternalId);
      if (!customer) {
        throw AppError.notFound("Customer not found");
      }
      customerId = customer.id;
    } else if (userType === "employee") {
      const isAdmin = roles?.includes("admin");

      if (!isAdmin) {
        const employee = await employeeRepository.findByExternalIdWithRoles(userExternalId);
        if (!employee) {
          throw AppError.notFound("Employee not found");
        }
        assignedEmployeeId = employee.id;
      }
    }

    const { tickets, total } = await ticketRepository.findAll({
      customerId,
      assignedEmployeeId,
      statusId,
      limit,
      offset,
    });

    const ticketIds = tickets.map((ticket: Ticket) => ticket.id);
    const lastCustomerMessagesMap =
      await messageRepository.findLastCustomerMessagesByTicketIds(ticketIds);

    return {
      tickets: tickets.map((ticket: Ticket) => {
        const lastMessage = lastCustomerMessagesMap.get(ticket.id);
        const lastCustomerMessage = lastMessage
          ? {
              externalId: lastMessage.externalId,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
            }
          : null;
        return formatTicketResponse(ticket, lastCustomerMessage);
      }),
      total,
      limit,
      offset,
    };
  },
};
