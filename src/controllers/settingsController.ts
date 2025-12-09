import { Request, Response, NextFunction } from "express";
import { getAllSettingsService } from "../services/getAllSettingsService";
import { updateAllSettingsService } from "../services/updateAllSettingsService";

export const settingsController = {
  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await getAllSettingsService.execute();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await updateAllSettingsService.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
