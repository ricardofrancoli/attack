import {
  type InferOutput,
  array,
  check,
  literal,
  number,
  object,
  optional,
  pipe,
  union,
} from "valibot";

export const Protocol = {
  closestEnemies: "closest-enemies",
  furthestEnemies: "furthest-enemies",
  assistAllies: "assist-allies",
  avoidCrossfire: "avoid-crossfire",
  prioritizeMech: "prioritize-mech",
  avoidMech: "avoid-mech",
} as const;

const PROTOCOL_GROUPS = [
  [Protocol.closestEnemies, Protocol.furthestEnemies],
  [Protocol.assistAllies, Protocol.avoidCrossfire],
  [Protocol.prioritizeMech, Protocol.avoidMech],
];

const EnemiesProtocol = union([
  literal(Protocol.closestEnemies),
  literal(Protocol.furthestEnemies),
]);
const AlliesProtocol = union([literal(Protocol.assistAllies), literal(Protocol.avoidCrossfire)]);
const MechProtocol = union([literal(Protocol.prioritizeMech), literal(Protocol.avoidMech)]);

export const Coordinates = object({ x: number(), y: number() });
const Enemies = object({ type: union([literal("soldier"), literal("mech")]), number: number() });
const Allies = number();

export const Radar = object({
  protocols: pipe(
    array(union([EnemiesProtocol, AlliesProtocol, MechProtocol])),
    check((protocols) => {
      return new Set(protocols).size === protocols.length;
    }, "Protocols must be unique"),
    check((protocols) => {
      for (const group of PROTOCOL_GROUPS) {
        const hasConflict = group.filter((protocol) => protocols.includes(protocol)).length > 1;

        if (!hasConflict) {
          continue;
        }

        return false;
      }

      return true;
    }, "Conflicting protocols detected"),
  ),
  scan: array(object({ coordinates: Coordinates, enemies: Enemies, allies: optional(Allies) })),
});

export type Radar = InferOutput<typeof Radar>;
export type Scan = Radar["scan"];
export type Coordinates = Radar["scan"][number]["coordinates"];
