import type { NextFunction, Request, Response } from "express";

export const createRadarCoordinates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send("Create Radar Coordinates...");
  } catch {
    console.error("Oooops, error at Create Radar Coordinates...");
  }
};
