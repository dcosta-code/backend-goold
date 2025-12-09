import { v4 as uuidv4 } from "uuid";
import { ticketRepository } from "../repositories/ticketRepository";
import { messageRepository } from "../repositories/messageRepository";
import { customerRepository } from "../repositories/customerRepository";
import { employeeRepository } from "../repositories/employeeRepository";
import { MessageResponse, SenderType } from "../types/message";
import { AppError } from "../utils/AppError";

interface CreateMessageOptions {
  ticketExternalId: string;
  userExternalId: string;
  userType: "customer" | "employee";
  roles?: string[];
  content: string;
}

export const createMessageService = {
  async execute(options: CreateMessageOptions): Promise<MessageResponse> {
    const { ticketExternalId, userExternalId, userType, roles, content } =
      options;

    const ticket = await ticketRepository.findByExternalId(ticketExternalId);
    if (!ticket) {
      throw AppError.notFound("Ticket not found");
    }

    let senderId: number;
    let senderType: SenderType;

    if (userType === "customer") {
      const customer = await customerRepository.findByExternalId(
        userExternalId
      );
      if (!customer || ticket.customerId !== customer.id) {
        throw AppError.forbidden("Access denied");
      }
      senderId = customer.id;
      senderType = "customer";
    } else {
      const employee = await employeeRepository.findByExternalIdWithRoles(
        userExternalId
      );

      if (!employee) {
        throw AppError.notFound("Employee not found");
      }

      if (ticket.assignedEmployeeId !== employee.id) {
        throw AppError.forbidden("Access denied");
      }

      senderId = employee.id;
      senderType = "employee";
    }

    const externalId = uuidv4();

    const message = await messageRepository.create({
      externalId,
      ticketId: ticket.id,
      senderType,
      senderId,
      content,
    });

    return {
      externalId: message.externalId,
      ticketExternalId: ticket.externalId,
      senderType: message.senderType,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    };
  },
};
