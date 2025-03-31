import { makeDirection } from "./geometry/makeDirection";
import { calculateFPS } from "./main";
import {
  div,
  divVar,
  mult,
  multVar,
  origo,
  sub,
  useMathFunction,
  Vec2,
} from "./math";

export const goTo = (entity, target: Vec2, time, whenDone = () => {}) => {
  const newEntityPos = entity.pos !== undefined ? entity.pos : entity;

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

  entity.vel = multVar(direction, newSpeed);

  // console.log(dist);

  const interval = setInterval(() => {
    if (
      Math.round(newEntityPos.x) === Math.round(target.x) &&
      Math.round(newEntityPos.y) === Math.round(target.y)
    ) {
      clearInterval(interval);
      entity.vel = origo;
      console.log("Målet nått!");
      whenDone();
    }
  }, 16);
};
