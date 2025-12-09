import { Router } from "express";
import { customerController } from "../controllers/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { updateCustomerProfileSchema } from "../validators/customerValidator";

const router = Router();

router.get(
  "/customer/profile",
  authMiddleware.authenticateCustomer,
  customerController.getProfile
);

router.patch(
  "/customer/profile",
  authMiddleware.authenticateCustomer,
  validate(updateCustomerProfileSchema),
  customerController.updateProfile
);

export default router;
