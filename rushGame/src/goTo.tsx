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

export const goTo = (entity, target: Vec2, time) => {
  const distance = sub(entity.pos, target);

  const direction = makeDirection(entity.pos, target);
  const newSpeed = divVar(distance, time);

  entity.vel = mult(direction, newSpeed);

  const interval = setInterval(() => {
    if (
      Math.round(entity.pos.x) === Math.round(target.x) &&
      Math.round(entity.pos.y) === Math.round(target.y)
    ) {
      clearInterval(interval);
      entity.vel = origo;
      console.log("Målet nått!");
    }
  }, 16);
};
