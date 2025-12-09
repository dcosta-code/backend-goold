import { ticketRepository } from "../repositories/ticketRepository";
import { customerRepository } from "../repositories/customerRepository";
import { employeeRepository } from "../repositories/employeeRepository";
import { TicketResponse } from "../types/ticket";
import { formatTicketResponse } from "./createTicketService";
import { AppError } from "../utils/AppError";

interface GetTicketOptions {
  ticketExternalId: string;
  userExternalId: string;
  userType: "customer" | "employee";
  roles?: string[];
}

export const getTicketService = {
  async execute(options: GetTicketOptions): Promise<TicketResponse> {
    const { ticketExternalId, userExternalId, userType, roles } = options;

    const ticket = await ticketRepository.findByExternalId(ticketExternalId);
    if (!ticket) {
      throw AppError.notFound("Ticket not found");
    }

    if (userType === "customer") {
      const customer = await customerRepository.findByExternalId(userExternalId);
      if (!customer || ticket.customerId !== customer.id) {
        throw AppError.forbidden("Access denied");
      }
    } else if (userType === "employee") {
      const isAdmin = roles?.includes("admin");

      if (!isAdmin) {
        const employee = await employeeRepository.findByExternalIdWithRoles(userExternalId);
        if (!employee || ticket.assignedEmployeeId !== employee.id) {
          throw AppError.forbidden("Access denied");
        }
      }
    }

    return formatTicketResponse(ticket);
  },
};
