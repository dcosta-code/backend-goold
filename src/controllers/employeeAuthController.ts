import { Request, Response, NextFunction } from "express";
import { loginEmployeeService } from "../services/loginEmployeeService";
import { refreshEmployeeTokenService } from "../services/refreshEmployeeTokenService";

export const employeeAuthController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await loginEmployeeService.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await refreshEmployeeTokenService.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
