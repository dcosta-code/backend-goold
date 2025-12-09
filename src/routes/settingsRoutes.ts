import { Router } from "express";
import { settingsController } from "../controllers/settingsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validate";
import { updateAllSettingsSchema } from "../validators/settingsValidator";
import { Permissions } from "../types/permission";

const router = Router();

router.get(
  "/settings",
  authMiddleware.authenticateEmployee,
  requirePermission(Permissions.CONFIGURATIONS_MANAGER),
  settingsController.getAll
);

router.put(
  "/settings",
  authMiddleware.authenticateEmployee,
  requirePermission(Permissions.CONFIGURATIONS_MANAGER),
  validate(updateAllSettingsSchema),
  settingsController.updateAll
);

export { router as settingsRoutes };
