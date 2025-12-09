import { Router } from "express";
import { healthController } from "../controllers/healthController";

const router = Router();

router.get("/health", healthController.check);

export default router;
