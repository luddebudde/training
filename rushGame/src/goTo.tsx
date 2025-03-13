import { multVar, sub } from "./math";

export const goTo = (
  entity,
  location,
  movement = { speed: undefined, time: undefined }
) => {
  const distanceVec = sub(entity.pos, location);

  const dist = Math.sqrt(
    distanceVec.x * distanceVec.x + distanceVec.y * distanceVec.y
  );
  const direction = {
    x: -distanceVec.x / (dist + 0.001),
    y: -distanceVec.y / (dist + 0.001),
  };

  const newSpeed =
    movement.speed !== undefined ? movement.speed : dist / movement.time;

  const timeToReach = dist / newSpeed; // Tid i millisekunder

  entity.vel = multVar(direction, newSpeed);

  setTimeout(() => {
    entity.vel = { x: 0, y: 0 };
  }, timeToReach * 1000);
};
