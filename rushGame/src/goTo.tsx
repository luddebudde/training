import { makeDirection } from "./geometry/makeDirection";
import { calculateFPS } from "./main";
import { div, divVar, mult, multVar, origo, sub, Vec2 } from "./math";

export const goTo = (
  entity,
  target: Vec2,
  time,
  deltaTime
  // movement = { speed: undefined, time: undefined }
) => {
  // const distanceVec = sub(entity.pos, location);

  // const dist = Math.sqrt(
  //   distanceVec.x * distanceVec.x + distanceVec.y * distanceVec.y
  // );
  // const direction = {
  //   x: -distanceVec.x / (dist + 0.001),
  //   y: -distanceVec.y / (dist + 0.001),
  // };

  // const newSpeed =
  //   movement.speed !== undefined ? movement.speed : dist / movement.time;

  // const timeToReach = dist / newSpeed;

  // entity.vel = multVar(direction, newSpeed);

  // setTimeout(() => {
  //   entity.vel = origo;
  // }, movement.time * 1000);

  const distance = sub(entity.pos, target);

  const direction = makeDirection(entity.pos, target);
  const newSpeed = divVar(distance, time);

  console.log(direction, newSpeed);

  entity.vel = mult(direction, newSpeed);

  setTimeout(() => {
    entity.vel = origo;
  }, time * deltaTime);
};
