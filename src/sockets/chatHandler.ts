import { Server, Socket } from "socket.io";
import { createMessageService } from "../services/createMessageService";
import { ticketRepository } from "../repositories/ticketRepository";
import { customerRepository } from "../repositories/customerRepository";
import { employeeRepository } from "../repositories/employeeRepository";

interface JoinPayload {
  ticketId: string;
}

interface LeavePayload {
  ticketId: string;
}

interface SendMessagePayload {
  tempId: string;
  ticketId: string;
  content: string;
}

const canAccessTicket = async (
  ticketExternalId: string,
  userExternalId: string,
  userType: "customer" | "employee",
  roles?: string[]
): Promise<boolean> => {
  const ticket = await ticketRepository.findByExternalId(ticketExternalId);
  if (!ticket) return false;

  if (userType === "customer") {
    const customer = await customerRepository.findByExternalId(userExternalId);
    return customer !== null && ticket.customerId === customer.id;
  } else {
    const isAdmin = roles?.includes("admin");
    if (isAdmin) return true;

    const employee = await employeeRepository.findByExternalIdWithRoles(
      userExternalId
    );
    return employee !== null && ticket.assignedEmployeeId === employee.id;
  }
};

export const registerChatHandlers = (io: Server, socket: Socket): void => {
  const user = socket.user;

  socket.on("join", async (payload: JoinPayload) => {
    try {
      const { ticketId } = payload;

      const hasAccess = await canAccessTicket(
        ticketId,
        user.externalId,
        user.userType,
        user.roles
      );

      if (!hasAccess) {
        socket.emit("chat_event", {
          type: "error",
          message: "Access denied to this ticket",
        });
        return;
      }

      const roomName = `ticket:${ticketId}`;
      await socket.join(roomName);

      socket.emit("chat_event", {
        type: "joined",
        ticketId,
      });
    } catch {
      socket.emit("chat_event", {
        type: "error",
        message: "Failed to join ticket room",
      });
    }
  });

  socket.on("leave", async (payload: LeavePayload) => {
    try {
      const { ticketId } = payload;
      const roomName = `ticket:${ticketId}`;
      await socket.leave(roomName);

      socket.emit("chat_event", {
        type: "left",
        ticketId,
      });
    } catch {
      socket.emit("chat_event", {
        type: "error",
        message: "Failed to leave ticket room",
      });
    }
  });

  socket.on("send_message", async (payload: SendMessagePayload) => {
    try {
      const { tempId, ticketId, content } = payload;

      if (!content || content.trim().length === 0) {
        socket.emit("chat_event", {
          type: "message_status",
          tempId,
          status: "error",
          message: "Message content cannot be empty",
        });
        return;
      }

      const message = await createMessageService.execute({
        ticketExternalId: ticketId,
        userExternalId: user.externalId,
        userType: user.userType,
        roles: user.roles,
        content: content.trim(),
      });

      socket.emit("chat_event", {
        type: "message_status",
        tempId,
        status: "sent",
        messageId: message.externalId,
      });

      const roomName = `ticket:${ticketId}`;
      io.to(roomName).emit("chat_event", {
        type: "new_message",
        message,
      });
    } catch (error) {
      const { tempId } = payload;
      socket.emit("chat_event", {
        type: "message_status",
        tempId,
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to send message",
      });
    }
  });

  socket.on("disconnect", () => {});
};
