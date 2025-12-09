import { Request, Response, NextFunction } from "express";
import { createTicketService } from "../services/createTicketService";
import { listTicketsService } from "../services/listTicketsService";
import { getTicketService } from "../services/getTicketService";
import { assignTicketService } from "../services/assignTicketService";
import { updateTicketStatusService } from "../services/updateTicketStatusService";
import { getTicketMessagesService } from "../services/getTicketMessagesService";
import { hasActiveTicketService } from "../services/hasActiveTicketService";

export const ticketController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await createTicketService.execute({
        customerExternalId: req.user!.externalId,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, limit, offset } = req.query;
      const result = await listTicketsService.execute({
        userExternalId: req.user!.externalId,
        userType: req.user!.userType,
        roles: req.user!.roles,
        status: status as string | undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { externalId } = req.params;
      const result = await getTicketService.execute({
        ticketExternalId: externalId,
        userExternalId: req.user!.externalId,
        userType: req.user!.userType,
        roles: req.user!.roles,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async assign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { externalId } = req.params;
      const { employeeExternalId } = req.body;
      const result = await assignTicketService.execute({
        ticketExternalId: externalId,
        employeeExternalId,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { externalId } = req.params;
      const { statusExternalId } = req.body;
      const result = await updateTicketStatusService.execute({
        ticketExternalId: externalId,
        statusExternalId,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { externalId } = req.params;
      const { limit, offset } = req.query;
      const result = await getTicketMessagesService.execute({
        ticketExternalId: externalId,
        userExternalId: req.user!.externalId,
        userType: req.user!.userType,
        roles: req.user!.roles,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async hasActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await hasActiveTicketService.execute({
        customerExternalId: req.user!.externalId,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
