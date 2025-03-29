import { add, multVar, sub, Vec2 } from "../math";

export type Square = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export const isPointInsideArea = (entity, square: Square, margin = 0) => {
  let object = {
    collision: false,
    x: 1,
    y: 1,
  };

  // console.log(
  //   vec.x + margin >= square.x && vec.x - margin <= square.x + square.width,
  //   "&&",
  //   vec.x + margin > square.x || vec.x - margin < square.x + square.width,
  //   "||"
  // );

  const previusPos = sub(entity.pos, multVar(entity.vel, 2));

  if (
    entity.pos.x + margin >= square.x &&
    entity.pos.x - margin <= square.x + square.width &&
    entity.pos.y + margin >= square.y &&
    entity.pos.y - margin <= square.y + square.height
  ) {
    // vec.y = -vec.y;
    // isInside = true;
    // object.collision = true;
    // object.x = -1;
    // if (
    //   entity.pos.x + margin > square.x ||
    //   entity.pos.x - margin > square.x + square.width
    // ) {
    //   // entity.vel.x *= -1;
    //   console.log("true");
    //   object.collision = true;
    // }
    // // else
    // if (
    //   entity.pos.y + margin > square.y ||
    //   entity.pos.y - margin < square.y + square.height
    // ) {
    //   entity.vel.y *= -1;
    //   object.collision = true;
    // }

    if (previusPos.x + margin < square.x) {
      entity.vel.x *= -1;
      console.log("true");
    }
    if (previusPos.x - margin > square.x + square.width) {
      entity.vel.x *= -1;
      console.log("true");
    }
    if (previusPos.y + margin < square.y) {
      entity.vel.y *= -1;
      console.log("true");
    }
    if (previusPos.y - margin > square.y + square.height) {
      entity.vel.y *= -1;
      console.log("true");
    }
  }

  return object;
};
