import { Router } from "express";
import { employeeAuthController } from "../controllers/employeeAuthController";
import { validate } from "../middlewares/validate";
import {
  loginEmployeeSchema,
  refreshEmployeeTokenSchema,
} from "../validators/employeeAuthValidator";

const router = Router();

router.post("/employee/auth/login", validate(loginEmployeeSchema), employeeAuthController.login);
router.post("/employee/auth/refresh", validate(refreshEmployeeTokenSchema), employeeAuthController.refresh);

export { router as employeeAuthRoutes };
