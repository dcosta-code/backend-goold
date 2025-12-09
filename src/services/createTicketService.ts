import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../config/sequelize";
import { ticketRepository } from "../repositories/ticketRepository";
import { ticketStatusRepository } from "../repositories/ticketStatusRepository";
import { customerRepository } from "../repositories/customerRepository";
import { getAvailableSupportEmployeeService } from "./getAvailableSupportEmployeeService";
import { TicketResponse } from "../types/ticket";
import { AppError } from "../utils/AppError";
import { Tag } from "../models/Tag";

interface CreateTicketInternalDTO {
  customerExternalId: string;
}

interface LastCustomerMessageData {
  externalId: string;
  content: string;
  createdAt: Date;
}

function formatTicketResponse(
  ticket: {
    externalId: string;
    createdAt: Date;
    updatedAt: Date;
    status?: { externalId: string; name: string } | null;
    customer?: { externalId: string; fullName: string; email: string } | null;
    startedEmployee?: {
      externalId: string;
      fullName: string;
      email: string;
    } | null;
    assignedEmployee?: {
      externalId: string;
      fullName: string;
      email: string;
    } | null;
    tags?: Tag[];
  },
  lastCustomerMessage?: LastCustomerMessageData | null
): TicketResponse {
  return {
    externalId: ticket.externalId,
    status: ticket.status
      ? {
          externalId: ticket.status.externalId,
          name: ticket.status.name,
        }
      : null,
    customer: ticket.customer
      ? {
          externalId: ticket.customer.externalId,
          fullName: ticket.customer.fullName,
          email: ticket.customer.email,
        }
      : null,
    startedEmployee: ticket.startedEmployee
      ? {
          externalId: ticket.startedEmployee.externalId,
          fullName: ticket.startedEmployee.fullName,
          email: ticket.startedEmployee.email,
        }
      : null,
    assignedEmployee: ticket.assignedEmployee
      ? {
          externalId: ticket.assignedEmployee.externalId,
          fullName: ticket.assignedEmployee.fullName,
          email: ticket.assignedEmployee.email,
        }
      : null,
    tags: (ticket.tags || []).map((tag) => ({
      externalId: tag.externalId,
      name: tag.name,
      backgroundColor: tag.backgroundColor,
      textColor: tag.textColor,
    })),
    lastCustomerMessage: lastCustomerMessage || null,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

export const createTicketService = {
  async execute(data: CreateTicketInternalDTO): Promise<TicketResponse> {
    const customer = await customerRepository.findByExternalId(
      data.customerExternalId
    );
    if (!customer) {
      throw AppError.notFound("Customer not found");
    }

    const openStatus = await ticketStatusRepository.findByName("open");
    if (!openStatus) {
      throw AppError.badRequest("Ticket status 'open' not found");
    }

    const assignedEmployee = await getAvailableSupportEmployeeService.execute();

    const externalId = uuidv4();

    const ticket = await sequelize.transaction(async (transaction) => {
      const newTicket = await ticketRepository.create(
        {
          externalId,
          statusId: openStatus.id,
          customerId: customer.id,
          startedEmployeeId: assignedEmployee.id,
          assignedEmployeeId: assignedEmployee.id,
        },
        transaction
      );

      return newTicket;
    });

    const ticketWithRelations = await ticketRepository.findByExternalId(
      ticket.externalId
    );

    if (!ticketWithRelations) {
      throw AppError.badRequest("Error retrieving created ticket");
    }

    return formatTicketResponse(ticketWithRelations);
  },
};

export { formatTicketResponse };
