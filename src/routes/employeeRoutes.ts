import { Router } from "express";
import { employeeController } from "../controllers/employeeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRoles, requirePermission } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validate";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../validators/employeeValidator";
import { Roles } from "../types/role";
import { Permissions } from "../types/permission";

const router = Router();

router.get(
  "/employee",
  authMiddleware.authenticateEmployee,
  requireRoles(Roles.ADMIN),
  employeeController.list
);

router.post(
  "/employee",
  authMiddleware.authenticateEmployee,
  requireRoles(Roles.ADMIN),
  requirePermission(Permissions.EMPLOYEES_MANAGER),
  validate(createEmployeeSchema),
  employeeController.create
);

router.get(
  "/employee/:externalId",
  authMiddleware.authenticateEmployee,
  requirePermission(Permissions.EMPLOYEES_MANAGER),
  employeeController.get
);

router.patch(
  "/employee/:externalId",
  authMiddleware.authenticateEmployee,
  requirePermission(Permissions.EMPLOYEES_MANAGER),
  validate(updateEmployeeSchema),
  employeeController.update
);

router.delete(
  "/employee/:externalId",
  authMiddleware.authenticateEmployee,
  requireRoles(Roles.ADMIN),
  employeeController.delete
);

export { router as employeeRoutes };
