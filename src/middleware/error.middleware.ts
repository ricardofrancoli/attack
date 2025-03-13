import type { NextFunction, Request, Response } from "express";

/**
 * Global error handling middleware
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: err.message,
    stack: err.stack,
  });
};
