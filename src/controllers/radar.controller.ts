import type { NextFunction, Request, Response } from "express";
import { parse } from "valibot";
import { Radar } from "../models/radar.model";

export const createRadarCoordinates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { protocols, scan } = parse(Radar, req.body);

    console.log("body", req.body, protocols, scan);

    res.send("Create Radar Coordinates...");
  } catch (err) {
    console.error("Oooops, error at Create Radar Coordinates...", err);
  }
};
