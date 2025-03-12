import type { NextFunction, Request, Response } from "express";
import { parse } from "valibot";
import { Radar } from "../models/radar.model";
import { saveRadarCoordinates } from "../services/radar.service";

export const createRadarCoordinates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const radar = parse(Radar, req.body);

    const coordinates = await saveRadarCoordinates(radar);

    res.status(200).json(coordinates);
  } catch (err) {
    console.error("Oooops, error at Create Radar Coordinates...", err);
  }
};
