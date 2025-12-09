import { TicketStatus } from "../models/TicketStatus";

export const ticketStatusRepository = {
  async findByName(name: string): Promise<TicketStatus | null> {
    return TicketStatus.findOne({ where: { name } });
  },

  async findByExternalId(externalId: string): Promise<TicketStatus | null> {
    return TicketStatus.findOne({ where: { externalId } });
  },

  async findAll(): Promise<TicketStatus[]> {
    return TicketStatus.findAll({ order: [["id", "ASC"]] });
  },
};
