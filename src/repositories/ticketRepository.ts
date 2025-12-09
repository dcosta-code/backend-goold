import { Op, Transaction } from "sequelize";
import { Ticket } from "../models/Ticket";
import { TicketStatus } from "../models/TicketStatus";
import { Customer } from "../models/Customer";
import { Employee } from "../models/Employee";
import { Tag } from "../models/Tag";

interface CreateTicketData {
  externalId: string;
  statusId: number;
  customerId: number;
  startedEmployeeId: number;
  assignedEmployeeId: number;
}

interface UpdateTicketData {
  statusId?: number;
  assignedEmployeeId?: number;
}

interface FindTicketsOptions {
  customerId?: number;
  assignedEmployeeId?: number;
  statusId?: number;
  limit?: number;
  offset?: number;
}

export const ticketRepository = {
  async create(
    data: CreateTicketData,
    transaction?: Transaction
  ): Promise<Ticket> {
    return Ticket.create(data, { transaction });
  },

  async findByExternalId(externalId: string): Promise<Ticket | null> {
    return Ticket.findOne({
      where: { externalId },
      include: [
        { model: TicketStatus, as: "status" },
        { model: Customer, as: "customer" },
        { model: Employee, as: "startedEmployee" },
        { model: Employee, as: "assignedEmployee" },
        { model: Tag, as: "tags" },
      ],
    });
  },

  async findById(id: number): Promise<Ticket | null> {
    return Ticket.findByPk(id, {
      include: [
        { model: TicketStatus, as: "status" },
        { model: Customer, as: "customer" },
        { model: Employee, as: "startedEmployee" },
        { model: Employee, as: "assignedEmployee" },
        { model: Tag, as: "tags" },
      ],
    });
  },

  async findAll(options: FindTicketsOptions = {}): Promise<{
    tickets: Ticket[];
    total: number;
  }> {
    const where: Record<string, unknown> = {};

    if (options.customerId) {
      where.customerId = options.customerId;
    }
    if (options.assignedEmployeeId) {
      where.assignedEmployeeId = options.assignedEmployeeId;
    }
    if (options.statusId) {
      where.statusId = options.statusId;
    }

    const { count, rows } = await Ticket.findAndCountAll({
      where,
      include: [
        { model: TicketStatus, as: "status" },
        { model: Customer, as: "customer" },
        { model: Employee, as: "startedEmployee" },
        { model: Employee, as: "assignedEmployee" },
        { model: Tag, as: "tags" },
      ],
      order: [["createdAt", "DESC"]],
      limit: options.limit,
      offset: options.offset,
    });

    return { tickets: rows, total: count };
  },

  async update(
    id: number,
    data: UpdateTicketData,
    transaction?: Transaction
  ): Promise<void> {
    await Ticket.update(data, { where: { id }, transaction });
  },

  async setTags(
    ticketId: number,
    tagIds: number[],
    transaction?: Transaction
  ): Promise<void> {
    const ticket = await Ticket.findByPk(ticketId);
    if (ticket) {
      await (ticket as any).setTags(tagIds, { transaction });
    }
  },

  async addTags(
    ticketId: number,
    tagIds: number[],
    transaction?: Transaction
  ): Promise<void> {
    const ticket = await Ticket.findByPk(ticketId);
    if (ticket) {
      await (ticket as any).addTags(tagIds, { transaction });
    }
  },

  async removeTags(
    ticketId: number,
    tagIds: number[],
    transaction?: Transaction
  ): Promise<void> {
    const ticket = await Ticket.findByPk(ticketId);
    if (ticket) {
      await (ticket as any).removeTags(tagIds, { transaction });
    }
  },

  async countByAssignedEmployee(employeeId: number): Promise<number> {
    return Ticket.count({
      where: {
        assignedEmployeeId: employeeId,
        statusId: { [Op.ne]: 3 },
      },
    });
  },

  async hasActiveTicketByCustomerId(customerId: number): Promise<boolean> {
    const count = await Ticket.count({
      where: { customerId },
      include: [
        {
          model: TicketStatus,
          as: "status",
          where: { name: { [Op.in]: ["open", "in_progress"] } },
          required: true,
        },
      ],
    });
    return count > 0;
  },
};
