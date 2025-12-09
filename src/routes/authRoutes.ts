import { Router } from "express";
import { authController } from "../controllers/authController";
import { passwordResetController } from "../controllers/passwordResetController";
import { validate } from "../middlewares/validate";
import {
  registerCustomerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validators/authValidator";
import {
  forgotPasswordSchema,
  verifyCodeSchema,
  resetPasswordSchema,
} from "../validators/passwordResetValidator";

const router = Router();

router.post(
  "/auth/register",
  validate(registerCustomerSchema),
  authController.register
);
router.post("/auth/login", validate(loginSchema), authController.login);
router.post(
  "/auth/refresh",
  validate(refreshTokenSchema),
  authController.refresh
);
router.post(
  "/auth/forgot-password",
  validate(forgotPasswordSchema),
  passwordResetController.forgotPassword
);
router.post(
  "/auth/verify-code",
  validate(verifyCodeSchema),
  passwordResetController.verifyCode
);
router.post(
  "/auth/reset-password",
  validate(resetPasswordSchema),
  passwordResetController.resetPassword
);

export default router;
