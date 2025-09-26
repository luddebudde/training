import { multVar, numberIsWithinMargin, origo, Vec2 } from "./math";

export const goTo = (entity: any, target: Vec2, time, whenDone = () => {}) => {
  let newEntityPos = entity.pos !== undefined ? entity.pos : entity;

  const diff = {
    x: newEntityPos.x - target.x,
    y: newEntityPos.y - target.y,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  const direction = {
    x: -diff.x / dist,
    y: -diff.y / dist,
  };
  const newSpeed = dist / time;

  if (isNaN(direction.x) || isNaN(direction.y)) {
    whenDone();
    return;
  }

  entity.vel = multVar(direction, newSpeed);

  const safetyMargin = Math.max(Math.abs(entity.vel.x), Math.abs(entity.vel.y));

  const interval = setInterval(() => {
    newEntityPos = entity.pos !== undefined ? entity.pos : entity;

    if (
      numberIsWithinMargin(target.x, newEntityPos.x, safetyMargin) &&
      numberIsWithinMargin(target.y, newEntityPos.y, safetyMargin)
    ) {
      clearInterval(interval);
      newEntityPos.x = target.x;
      newEntityPos.y = target.y;

      entity.vel = origo;
      console.log("Målet nått!");
      whenDone();
    }
  }, 16);
};
