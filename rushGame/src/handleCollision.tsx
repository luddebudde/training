import { add, dot, multVar, origo, sub } from "./math";

export const handleCollision = (firstEntity, secondEntity) => {
  const resolveOverlap = (c1, c2) => {
    const distance = sub(c1.pos, c2.pos);
    const distLength = Math.sqrt(distance.x ** 2 + distance.y ** 2);
    const overlap = c1.radius + c2.radius - distLength;

    if (overlap > 0) {
      const correction = multVar(distance, overlap / distLength / 2);
      c1.pos = add(c1.pos, correction);
      c2.pos = sub(c2.pos, correction);
    }
  };

  resolveOverlap(firstEntity, secondEntity);

  const newVel = (c1, c2) => {
    const diffPos = sub(c1.pos, c2.pos);
    const diffVel = sub(c1.vel, c2.vel);

    const k1 = (2 * c2.mass) / (c1.mass + c2.mass);
    const k2 = dot(diffVel, diffPos) / dot(diffPos, diffPos);

    return sub(c1.vel, multVar(diffPos, k1 * k2));
  };

  let v1 = newVel(firstEntity, secondEntity);
  let v2 = newVel(secondEntity, firstEntity);

  //   firstEntity.vel = v1;
  //   secondEntity.vel = v2;

  console.log(firstEntity.vel, secondEntity.vel, v1, v2);

  // if (isNaN(v1.x) || isNaN(v1.y)) {
  //   v1 = origo;
  // }
  // if (isNaN(v2.x) || isNaN(v2.y)) {
  //   v2 = origo;
  // }
  return { v1: v1, v2: v2 };
};
