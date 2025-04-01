import { blackholes } from "./arrays";
import { Vec2 } from "./math";

export const createBlackhole = (pos: Vec2, vel: Vec2, radius, strength) => {
  const blackhole = {
    pos: pos,
    vel: vel,
    strength: strength,
    radius: radius,
    mass: 400,
    color: "black",
  };

  blackholes.push(blackhole);
};
