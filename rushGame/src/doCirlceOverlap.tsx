import { dot, sub } from "./math";

export function doCirclesOverlap(circle1, circle2) {
  const minDist = circle1.radius + circle2.radius;
  const r = sub(circle1.pos, circle2.pos);
  return dot(r, r) <= minDist ** 2;
}
