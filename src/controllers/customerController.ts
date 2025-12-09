import { Request, Response, NextFunction } from "express";
import { getCustomerProfileService } from "../services/getCustomerProfileService";
import { updateCustomerProfileService } from "../services/updateCustomerProfileService";

export const customerController = {
  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await getCustomerProfileService.execute(req.user!.externalId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await updateCustomerProfileService.execute(
        req.user!.externalId,
        req.body
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
2