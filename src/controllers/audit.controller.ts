import type { NextFunction, Request, Response } from "express";
import { queryAllAuditLogs } from "../services/audit.service";

export const deleteAuditLogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send("Delete Audit Log By Id...");
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
    res.send("Get Audit Log By Id...");
  } catch {
    console.error("Oooops, error at Get Audit Log By Id...");
  }
};
