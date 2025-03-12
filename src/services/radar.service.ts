import db from "../db/initialise";
import { Protocol, type Radar, type Scan } from "../models/radar.model";

const calculateDistance = (scan: Scan[number]): number => {
  const { x, y } = scan.coordinates;

  return Math.sqrt(x * x + y * y);
};

const sortCoordinatesByVicinity = (scan: Scan, order: "asc" | "desc"): Scan => {
  return scan.sort((a, b) => {
    if (order === "desc") {
      return calculateDistance(b) - calculateDistance(a);
    }

    return calculateDistance(a) - calculateDistance(b);
  });
};

export const insertOneRadarCoordinates = async (
  radar: Radar,
): Promise<Scan[number]["coordinates"] | undefined> => {
  const { protocols, scan } = radar;

  if (scan.length === 0) {
    return;
  }

  const protocolSet = new Set(protocols);

  let filteredScan = scan.filter((entry) => {
    const distance = calculateDistance(entry);

    return distance <= 100;
  });

  if (filteredScan.length === 0) {
    return;
  }

  if (protocolSet.has(Protocol.avoidMech)) {
    filteredScan = filteredScan.filter((entry) => entry.enemies.type !== "mech");
  }

  if (protocolSet.has(Protocol.avoidCrossfire)) {
    filteredScan = filteredScan.filter((entry) => !entry.allies);
  }

  if (filteredScan.length === 0) {
    return;
  }

  if (protocolSet.has(Protocol.prioritizeMech)) {
    const mechEntries = filteredScan.filter((entry) => entry.enemies.type === "mech");

    if (mechEntries.length > 0) {
      filteredScan = mechEntries;
    }
  }

  if (protocolSet.has(Protocol.assistAllies)) {
    const alliesEntries = filteredScan.filter((entry) => !!entry.allies);

    if (alliesEntries.length > 0) {
      filteredScan = alliesEntries;
    }
  }

  if (protocolSet.has(Protocol.closestEnemies)) {
    filteredScan = sortCoordinatesByVicinity(filteredScan, "asc");
  } else if (protocolSet.has(Protocol.furthestEnemies)) {
    filteredScan = sortCoordinatesByVicinity(filteredScan, "desc");
  }

  const coordinates = filteredScan[0].coordinates;

  await db.radarCalculations.insertOne({ ...coordinates });

  return coordinates;
};
