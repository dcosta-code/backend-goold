import { Request, Response, NextFunction } from "express";
import { registerCustomerService } from "../services/registerCustomerService";
import { loginCustomerService } from "../services/loginCustomerService";
import { refreshTokenService } from "../services/refreshTokenService";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await registerCustomerService.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await loginCustomerService.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await refreshTokenService.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
