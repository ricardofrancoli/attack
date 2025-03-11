import { Router } from "express";
import { createRadarCoordinates } from "../controllers/radar.controller";

const router = Router();

/**
 * @route POST /api/radar
 * @desc Create a new radar coordinates entry
 */
router.post("/", createRadarCoordinates);

export default router;
