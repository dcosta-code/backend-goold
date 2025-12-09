import { Router } from "express";
import { ticketController } from "../controllers/ticketController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validate";
import {
  assignTicketSchema,
  updateTicketStatusSchema,
} from "../validators/ticketValidator";
import { Permissions } from "../types/permission";

const router = Router();

router.post(
  "/tickets",
  authMiddleware.authenticateCustomer,
  ticketController.create
);

router.get(
  "/tickets/has-active",
  authMiddleware.authenticateCustomer,
  ticketController.hasActive
);

router.get(
  "/tickets",
  authMiddleware.authenticateEmployee,
  ticketController.list
);

router.get(
  "/tickets/:externalId",
  authMiddleware.authenticateEmployee,
  requirePermission(Permissions.SUPPORT_TICKETS),
  ticketController.get
);

router.patch(
  "/tickets/:externalId/assign",
  authMiddleware.authenticateEmployee,
  requirePermission(Permissions.SUPPORT_TICKETS),
  validate(assignTicketSchema),
  ticketController.assign
);

router.patch(
  "/tickets/:externalId/status",
  authMiddleware.authenticateEmployee,
  requirePermission(Permissions.SUPPORT_TICKETS),
  validate(updateTicketStatusSchema),
  ticketController.updateStatus
);

router.get(
  "/tickets/:externalId/messages",
  authMiddleware.authenticate,
  ticketController.getMessages
);

export { router as ticketRoutes };
