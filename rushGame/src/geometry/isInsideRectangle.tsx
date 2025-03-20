import { Vec2 } from "../math";

export const isPointInsideArea = (
  // pointX: number,
  // pointY: number,
  // areaX: number,
  // areaY: number,
  // areaWidth: number,
  // areaHeight: number
  vec: Vec2,
  square,
  margin = 0
) => {
  return (
    vec.x + margin >= square.x &&
    vec.x - margin <= square.x + square.width &&
    vec.y + margin >= square.y &&
    vec.y - margin <= square.y + square.height
  );
};
