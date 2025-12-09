import { Router } from "express";
import healthRoutes from "./healthRoutes";
import authRoutes from "./authRoutes";
import customerRoutes from "./customerRoutes";
import { employeeAuthRoutes } from "./employeeAuthRoutes";
import { employeeRoutes } from "./employeeRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { ticketRoutes } from "./ticketRoutes";

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(customerRoutes);
router.use(employeeAuthRoutes);
router.use(employeeRoutes);
router.use(settingsRoutes);
router.use(ticketRoutes);

export default router;
