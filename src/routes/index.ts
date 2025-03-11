import { Router } from "express";
import auditRoutes from "./audit.routes";
import pingRoutes from "./ping.routes";
import radarRoutes from "./radar.routes";

const router = Router();

router.use("/audit", auditRoutes);
router.use("/ping", pingRoutes);
router.use("/radar", radarRoutes);

export default router;
