import { Router } from "express";
import type { NextFunction, Request, Response } from "express";

const router = Router();

/**
 * @route GET /api/ping
 * @desc Ping
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("OK!");
});

export default router;
