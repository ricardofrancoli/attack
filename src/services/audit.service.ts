import { type Document, ObjectId, type WithId } from "mongodb";
import { array, instance, intersect, object, parse } from "valibot";
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

export const queryAuditLogById = async (
  id: string,
): Promise<(WithId<Document> & Coordinates) | undefined> => {
  const auditLog = await db.radarCalculations.findOne({ _id: new ObjectId(id) });

  if (!auditLog) {
    return;
  }

  return parse(intersect([Coordinates, object({ _id: instance(ObjectId) })]), auditLog, {
    message: "Invalid record of Coordinates and _ids",
  });
};

export const removeAuditLogById = async () => {};
