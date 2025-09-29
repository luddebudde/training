// export function doCirclesOverlap(circle1, circle2) {
//   const distance = Math.sqrt(
//     (circle2.pos.x - circle1.pos.x) ** 2 + (circle2.pos.y - circle1.pos.y) ** 2
//   );

import { vector } from "./vectors.js";

//   return distance <= circle1.radius + circle2.radius;
// }

export function doCirclesOverlap(circle1, circle2) {
  const minDist = circle1.radius + circle2.radius;
  const r = vector.eachOther.sub(circle1.pos, circle2.pos);
  return vector.eachOther.dot(r, r) <= minDist ** 2;
}
