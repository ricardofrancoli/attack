import type { NextFunction, Request, Response } from "express";
import { object, parse, string } from "valibot";
import {
  deleteOneAuditLogById,
  queryAllAuditLogs,
  queryAuditLogById,
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
  } catch {
    console.error("Oooops, error at Delete Audit Log By Id...");
  }
};

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditLogs = await queryAllAuditLogs();

    res.status(200).json({ status: "success", data: auditLogs });
  } catch {
    console.error("Oooops, error at Get Audit Logs...");
  }
};

export const getAuditLogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parse(object({ id: string() }), req.params);

    const auditLog = await queryAuditLogById(id);

    if (!auditLog) {
      res.status(404).json({
        status: "error",
        message: `Audit log with id ${id} not found`,
      });
      return;
    }

    res.status(200).json({ status: "success", data: auditLog });
  } catch (err) {
    console.error("Oooops, error at Get Audit Log By Id...", err);
  }
};
