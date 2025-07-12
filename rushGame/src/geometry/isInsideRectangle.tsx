import { add, multVar, sub, Vec2 } from "../math";

export type Square = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export const isPointInsideArea = (
  ctx,
  entity,
  square: Square,
  margin = 0,
  rectCenterX = 0,
  rectCenterY = 0
) => {
  let object = {
    collision: false,
    x: 1,
    y: 1,
  };

  const previusPos = sub(entity.pos, multVar(entity.vel, 2));

  // const newEntityPos = sub(entity.pos, { x: rectCenterX, y: rectCenterY });

  const newEntityPos = entity.pos;

  // console.log(square);

  ctx.beginPath();
  ctx.rect(-square.width / 2, -square.height / 2, square.width, square.height);
  ctx.fillStyle = "green";
  ctx.fill();

  if (
    newEntityPos.x + margin >= square.x &&
    newEntityPos.x - margin <= square.x + square.width &&
    newEntityPos.y + margin >= square.y &&
    newEntityPos.y - margin <= square.y + square.height
  ) {
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
