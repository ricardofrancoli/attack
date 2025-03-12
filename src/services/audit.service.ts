import { type Document, ObjectId, type WithId } from "mongodb";
import { array, instance, intersect, is, object, parse } from "valibot";
import db from "../db/initialise";
import { Coordinates } from "../models/radar.model";

export const queryAllAuditLogs = async (): Promise<(WithId<Document> & Coordinates)[]> => {
  const auditLogs = parse(
    array(intersect([Coordinates, object({ _id: instance(ObjectId) })])),
    await db.radarCalculations.find().toArray(),
    { message: "Invalid array record of Coordinates and _ids" },
  );

  return auditLogs;
};

export const queryAuditLogById = async () => {};

export const removeAuditLogById = async () => {};
