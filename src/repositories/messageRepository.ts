import { Op, Transaction } from "sequelize";
import { Message } from "../models/Message";
import { SenderType, SenderTypes } from "../types/message";

interface CreateMessageData {
  externalId: string;
  ticketId: number;
  senderType: SenderType;
  senderId: number;
  content: string;
}

interface FindMessagesOptions {
  ticketId: number;
  limit?: number;
  offset?: number;
}

export const messageRepository = {
  async create(
    data: CreateMessageData,
    transaction?: Transaction
  ): Promise<Message> {
    return Message.create(data, { transaction });
  },

  async findByExternalId(externalId: string): Promise<Message | null> {
    return Message.findOne({ where: { externalId } });
  },

  async findByTicketId(options: FindMessagesOptions): Promise<{
    messages: Message[];
    total: number;
  }> {
    const { count, rows } = await Message.findAndCountAll({
      where: { ticketId: options.ticketId },
      order: [["createdAt", "ASC"]],
      limit: options.limit,
      offset: options.offset,
    });

    return { messages: rows, total: count };
  },

  async countByTicketId(ticketId: number): Promise<number> {
    return Message.count({ where: { ticketId } });
  },

  async findLastCustomerMessagesByTicketIds(
    ticketIds: number[]
  ): Promise<Map<number, Message>> {
    if (ticketIds.length === 0) {
      return new Map();
    }

    const messages = await Message.findAll({
      where: {
        ticketId: { [Op.in]: ticketIds },
        senderType: SenderTypes.CUSTOMER,
      },
      order: [["createdAt", "DESC"]],
    });

    const lastMessageMap = new Map<number, Message>();
    for (const message of messages) {
      if (!lastMessageMap.has(message.ticketId)) {
        lastMessageMap.set(message.ticketId, message);
      }
    }

    return lastMessageMap;
  },
};
