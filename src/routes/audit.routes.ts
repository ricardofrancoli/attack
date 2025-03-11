import { Router } from "express";
import { deleteAuditLogById, getAuditLogById, getAuditLogs } from "../controllers/audit.controller";

const router = Router();

/**
 * @route GET /api/audit
 * @desc Get all audit logs
 */
router.get("/", getAuditLogs);

/**
 * @route GET /api/audit/:id
 * @desc Get an audit log by its id
 */
router.get("/:id", getAuditLogById);

/**
 * @route DELETE /api/audit/:id
 * @desc Delete an audit log by its id
 */
router.delete("/:id", deleteAuditLogById);

export default router;
