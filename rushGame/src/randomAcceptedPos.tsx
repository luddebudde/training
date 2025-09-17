import { world } from "./basics";
import { getDistance } from "./geometry/makeDirection";
import { Vec2 } from "./math";

export const randomAcceptedPos = (
  mainPos,
  forbiddenPos: Vec2,
  margin: number
) => {
  const randomPos = {
    x: world.width * Math.random(),
    y: world.height * Math.random(),
  };
  const distance = getDistance(randomPos, forbiddenPos);

  if (distance < margin) {
    requestAnimationFrame(randomAcceptedPos(mainPos, forbiddenPos, margin));
  } else {
    return randomPos;
  }
};
