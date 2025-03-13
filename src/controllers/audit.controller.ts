import type { NextFunction, Request, Response } from "express";
import { object, parse, string } from "valibot";
import {
  deleteOneAuditLogById,
  findAllAuditLogs,
  findOneAuditLogById,
} from "../services/audit.service";

export const deleteAuditLogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parse(object({ id: string() }), req.params);

    const isDeleted = await deleteOneAuditLogById(id);

    if (!isDeleted) {
      res.status(404).json({
        status: "error",
        message: `No audit log found with id ${id}`,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: `Audit log with id ${id} successfully deleted`,
    });
  } catch (err) {
    console.error("Oooops, error at Delete Audit Log By Id...");
    next(err);
  }
};

export const getAuditLogs = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const auditLogs = await findAllAuditLogs();

    res.status(200).json({ status: "success", data: auditLogs });
  } catch (err) {
    console.error("Oooops, error at Get Audit Logs...");
    next(err);
  }
};

export const getAuditLogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parse(object({ id: string() }), req.params);

    const auditLog = await findOneAuditLogById(id);

    if (!auditLog) {
      res.status(404).json({
        status: "error",
        message: `Audit log with id ${id} not found`,
      });
      return;
    }

    res.status(200).json({ status: "success", data: auditLog });
  } catch (err) {
    console.error("Oooops, error at Get Audit Log By Id...");
    next(err);
  }
};
