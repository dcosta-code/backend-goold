import { Request, Response, NextFunction } from "express";
import { createEmployeeService } from "../services/createEmployeeService";
import { updateEmployeeService } from "../services/updateEmployeeService";
import { listEmployeesService } from "../services/listEmployeesService";
import { deleteEmployeeService } from "../services/deleteEmployeeService";
import { getEmployeeService } from "../services/getEmployeeService";

export const employeeController = {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { externalId } = req.params;
      const result = await getEmployeeService.execute(externalId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await createEmployeeService.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { externalId } = req.params;
      const result = await updateEmployeeService.execute(externalId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const result = await listEmployeesService.execute({ search });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { externalId } = req.params;
      const requestingUserExternalId = req.user!.externalId;
      await deleteEmployeeService.execute({
        targetExternalId: externalId,
        requestingUserExternalId,
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
