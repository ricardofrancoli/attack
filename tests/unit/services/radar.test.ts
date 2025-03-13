import { describe, expect, it } from "vitest";
import { Protocol, type Scan } from "../../../src/models/radar.model";
import { insertOneRadarCoordinates } from "../../../src/services/radar.service";

describe("insertOneRadarCoordinates", () => {
  const mechFurthest: Scan[number] = {
    coordinates: { x: 70, y: -70 },
    enemies: { type: "mech", number: 12 },
  };

  const mechClosest: Scan[number] = {
    coordinates: { x: 1, y: -1 },
    enemies: { type: "mech", number: 12 },
  };

  const soldierMid: Scan[number] = {
    coordinates: { x: 50, y: 50 },
    enemies: { type: "soldier", number: 20 },
  };

  const scanWithAllies: Scan[number] = {
    coordinates: { x: 30, y: 30 },
    enemies: { type: "soldier", number: 5 },
    allies: 3,
  };

  const scanWithoutAllies: Scan[number] = {
    coordinates: { x: 40, y: 40 },
    enemies: { type: "soldier", number: 8 },
    allies: 0,
  };

  describe("Distance-based targeting", () => {
    it("should return furthest scan with furthest-enemies protocol", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.furthestEnemies],
        scan: [mechFurthest, mechClosest, soldierMid],
      });

      expect(coordinates).toEqual(mechFurthest.coordinates);
    });

    it("should return closest scan with closest-enemies protocol", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.closestEnemies],
        scan: [mechFurthest, mechClosest, soldierMid],
      });

      expect(coordinates).toEqual(mechClosest.coordinates);
    });
  });

  describe("Enemy type filtering", () => {
    it("should avoid mech enemies with avoid-mech protocol", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.avoidMech],
        scan: [mechFurthest, mechClosest, soldierMid],
      });

      expect(coordinates).toEqual(soldierMid.coordinates);
    });

    it("should prioritize mech enemies with prioritize-mech protocol", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.prioritizeMech],
        scan: [soldierMid, mechClosest],
      });

      expect(coordinates).toEqual(mechClosest.coordinates);
    });

    it("should return undefined if no valid targets after applying avoid-mech", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.avoidMech],
        scan: [mechFurthest, mechClosest],
      });

      expect(coordinates).toBeUndefined();
    });
  });

  describe("Ally-based targeting", () => {
    it("should prioritize positions with allies when using assist-allies protocol", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.assistAllies],
        scan: [scanWithAllies, scanWithoutAllies],
      });

      expect(coordinates).toEqual(scanWithAllies.coordinates);
    });

    it("should avoid positions with allies when using avoid-crossfire protocol", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.avoidCrossfire],
        scan: [scanWithAllies, scanWithoutAllies],
      });

      expect(coordinates).toEqual(scanWithoutAllies.coordinates);
    });
  });

  describe("Combined protocols", () => {
    it("should correctly apply multiple protocols in order", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.avoidMech, Protocol.closestEnemies],
        scan: [
          mechFurthest,
          mechClosest,
          soldierMid,
          { ...scanWithoutAllies, coordinates: { x: 20, y: 20 } }, // Closer soldier
        ],
      });

      // Should pick the closest non-mech enemy
      expect(coordinates).toEqual({ x: 20, y: 20 });
    });

    it("should handle prioritize-mech and furthest-enemies", () => {
      const nearMech = { ...mechClosest };
      const farMech = { ...mechFurthest };

      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.prioritizeMech, Protocol.furthestEnemies],
        scan: [nearMech, farMech, soldierMid],
      });

      // Should pick the furthest mech
      expect(coordinates).toEqual(farMech.coordinates);
    });
  });

  describe("Complex Combined Protocols", () => {
    const nearMech: Scan[number] = {
      coordinates: { x: 10, y: 10 },
      enemies: { type: "mech", number: 5 },
      allies: 0,
    };

    const farMech: Scan[number] = {
      coordinates: { x: 70, y: 70 },
      enemies: { type: "mech", number: 3 },
      allies: 0,
    };

    const nearSoldierWithAllies: Scan[number] = {
      coordinates: { x: 15, y: 15 },
      enemies: { type: "soldier", number: 10 },
      allies: 2,
    };

    const farSoldierWithoutAllies: Scan[number] = {
      coordinates: { x: 65, y: 65 },
      enemies: { type: "soldier", number: 8 },
      allies: 0,
    };

    const mediumSoldierWithoutAllies: Scan[number] = {
      coordinates: { x: 50, y: 50 },
      enemies: { type: "soldier", number: 12 },
      allies: 0,
    };

    const soldierWithAllies: Scan[number] = {
      coordinates: { x: 30, y: 30 },
      enemies: { type: "soldier", number: 1 },
      allies: 3,
    };

    it("should prioritize assist-allies over closest-enemies", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.assistAllies, Protocol.closestEnemies],
        scan: [nearSoldierWithAllies, farSoldierWithoutAllies, mediumSoldierWithoutAllies],
      });

      // Should pick the point with allies, even though it's not the closest
      expect(coordinates).toEqual(nearSoldierWithAllies.coordinates);
    });

    it("should apply closest-enemies as a tiebreaker when multiple points have allies", () => {
      const nearWithAllies = { ...nearSoldierWithAllies };
      const farWithAllies: Scan[number] = {
        coordinates: { x: 80, y: 80 },
        enemies: { type: "soldier", number: 5 },
        allies: 1,
      };

      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.assistAllies, Protocol.closestEnemies],
        scan: [nearWithAllies, farWithAllies, mediumSoldierWithoutAllies],
      });

      // Should pick the closer of the two points with allies
      expect(coordinates).toEqual(nearWithAllies.coordinates);
    });

    it("should apply avoid-mech before furthest-enemies", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.avoidMech, Protocol.furthestEnemies],
        scan: [nearMech, farMech, mediumSoldierWithoutAllies, farSoldierWithoutAllies],
      });

      // Should pick the furthest non-mech
      expect(coordinates).toEqual(farSoldierWithoutAllies.coordinates);
    });

    it("should prioritize avoid-crossfire over prioritize-mech", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.avoidCrossfire, Protocol.prioritizeMech],
        scan: [nearMech, soldierWithAllies],
      });

      // Should avoid points with allies even if it means not prioritizing mech
      expect(coordinates).toEqual(nearMech.coordinates);
    });

    it("should handle all three protocol groups together", () => {
      // Distance protocol + Allies protocol + Mech protocol
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.closestEnemies, Protocol.avoidCrossfire, Protocol.avoidMech],
        scan: [
          nearMech,
          farMech,
          nearSoldierWithAllies,
          farSoldierWithoutAllies,
          {
            coordinates: { x: 20, y: 20 },
            enemies: { type: "soldier", number: 7 },
            allies: 0,
          },
        ],
      });

      // Should pick the closest non-mech without allies
      expect(coordinates).toEqual({ x: 20, y: 20 });
    });

    it("should return undefined when combined protocols filter out all targets", () => {
      // Combination that leaves no valid targets
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.avoidCrossfire, Protocol.avoidMech],
        scan: [nearMech, farMech, nearSoldierWithAllies, soldierWithAllies],
      });

      // All targets have either mechs or allies, so none should be valid
      expect(coordinates).toBeUndefined();
    });
  });

  describe("Distance exclusions and inclusions", () => {
    it("should filter out targets beyond 100m regardless of protocols", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.closestEnemies],
        scan: [
          {
            coordinates: { x: 90, y: 90 }, // ~127m from origin, beyond limit
            enemies: { type: "soldier", number: 5 },
            allies: 0,
          },
          {
            coordinates: { x: 60, y: 60 }, // ~85m from origin, within limit
            enemies: { type: "soldier", number: 7 },
            allies: 0,
          },
        ],
      });

      expect(coordinates).toEqual({ x: 60, y: 60 });
    });

    it("should return undefined if all targets are beyond 100m", () => {
      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.closestEnemies],
        scan: [
          {
            coordinates: { x: 80, y: 80 }, // ~113m from origin, beyond limit
            enemies: { type: "soldier", number: 5 },
            allies: 0,
          },
          {
            coordinates: { x: 90, y: 90 }, // ~127m from origin, beyond limit
            enemies: { type: "soldier", number: 7 },
            allies: 0,
          },
        ],
      });

      expect(coordinates).toBeUndefined();
    });
  });

  describe("Edge cases", () => {
    it("should handle targets at same distance", () => {
      const target1: Scan[number] = {
        coordinates: { x: 5, y: 0 },
        enemies: { type: "soldier", number: 10 },
      };

      const target2: Scan[number] = {
        coordinates: { x: 3, y: 4 },
        enemies: { type: "soldier", number: 10 },
      };

      const coordinates = insertOneRadarCoordinates({
        protocols: [Protocol.closestEnemies],
        scan: [target1, target2],
      });

      // Either one could be returned
      expect([target1.coordinates, target2.coordinates]).toContainEqual(coordinates);
    });
  });
});
