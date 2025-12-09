import { Request, Response, NextFunction } from "express";
import { forgotPasswordService } from "../services/forgotPasswordService";
import { verifyCodeService } from "../services/verifyCodeService";
import { resetPasswordService } from "../services/resetPasswordService";

export const passwordResetController = {
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await forgotPasswordService.execute(req.body.cpf);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async verifyCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await verifyCodeService.execute(
        req.body.cpf,
        req.body.code
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await resetPasswordService.execute(req.body.token, req.body.newPassword);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  },
};
