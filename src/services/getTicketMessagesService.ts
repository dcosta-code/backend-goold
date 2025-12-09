import { ticketRepository } from "../repositories/ticketRepository";
import { messageRepository } from "../repositories/messageRepository";
import { customerRepository } from "../repositories/customerRepository";
import { employeeRepository } from "../repositories/employeeRepository";
import { MessageListResponse } from "../types/message";
import { AppError } from "../utils/AppError";

interface GetTicketMessagesOptions {
  ticketExternalId: string;
  userExternalId: string;
  userType: "customer" | "employee";
  roles?: string[];
  limit?: number;
  offset?: number;
}

export const getTicketMessagesService = {
  async execute(
    options: GetTicketMessagesOptions
  ): Promise<MessageListResponse> {
    const {
      ticketExternalId,
      userExternalId,
      userType,
      roles,
      limit = 50,
      offset = 0,
    } = options;

    const ticket = await ticketRepository.findByExternalId(ticketExternalId);
    if (!ticket) {
      throw AppError.notFound("Ticket not found");
    }

    if (userType === "customer") {
      const customer = await customerRepository.findByExternalId(
        userExternalId
      );
      if (!customer || ticket.customerId !== customer.id) {
        throw AppError.forbidden("Access denied");
      }
    } else if (userType === "employee") {
      const isAdmin = roles?.includes("admin");

      if (!isAdmin) {
        const employee = await employeeRepository.findByExternalIdWithRoles(
          userExternalId
        );
        if (!employee || ticket.assignedEmployeeId !== employee.id) {
          throw AppError.forbidden("Access denied");
        }
      }
    }

    const { messages, total } = await messageRepository.findByTicketId({
      ticketId: ticket.id,
      limit,
      offset,
    });

    return {
      messages: messages.map((message) => ({
        externalId: message.externalId,
        ticketExternalId: ticket.externalId,
        senderType: message.senderType,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt,
      })),
      total,
      limit,
      offset,
    };
  },
};
