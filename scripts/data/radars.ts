import type { Radar } from "../../src/models/radar.model";

export const radars: Radar[] = [
  {
    protocols: ["assist-allies", "closest-enemies"],
    scan: [
      {
        coordinates: { x: 1, y: -1 },
        enemies: { type: "mech", number: 10 },
      },
    ],
  },
  {
    protocols: ["avoid-crossfire", "furthest-enemies"],
    scan: [
      {
        coordinates: { x: 10, y: -10 },
        enemies: { type: "mech", number: 100 },
      },
    ],
  },
  {
    protocols: ["prioritize-mech", "assist-allies"],
    scan: [
      {
        coordinates: { x: 20, y: -20 },
        enemies: { type: "soldier", number: 1000 },
      },
    ],
  },
];
