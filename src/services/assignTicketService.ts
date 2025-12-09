import { ticketRepository } from "../repositories/ticketRepository";
import { employeeRepository } from "../repositories/employeeRepository";
import { TicketResponse } from "../types/ticket";
import { formatTicketResponse } from "./createTicketService";
import { AppError } from "../utils/AppError";
import { Roles } from "../types/role";

interface AssignTicketOptions {
  ticketExternalId: string;
  employeeExternalId: string;
}

export const assignTicketService = {
  async execute(options: AssignTicketOptions): Promise<TicketResponse> {
    const { ticketExternalId, employeeExternalId } = options;

    const ticket = await ticketRepository.findByExternalId(ticketExternalId);
    if (!ticket) {
      throw AppError.notFound("Ticket not found");
    }

    const employee = await employeeRepository.findByExternalIdWithRoles(employeeExternalId);
    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    if (!employee.isActive) {
      throw AppError.badRequest("Employee is not active");
    }

    const employeeRoles = (employee as any).roles || [];
    const hasSupport = employeeRoles.some(
      (role: { name: string }) => role.name === Roles.SUPPORT || role.name === Roles.ADMIN
    );
    if (!hasSupport) {
      throw AppError.badRequest("Employee must have support or admin role");
    }

    await ticketRepository.update(ticket.id, {
      assignedEmployeeId: employee.id,
    });

    const updatedTicket = await ticketRepository.findByExternalId(ticketExternalId);
    if (!updatedTicket) {
      throw AppError.badRequest("Error retrieving updated ticket");
    }

    return formatTicketResponse(updatedTicket);
  },
};
