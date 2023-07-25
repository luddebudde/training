import { makeDirection } from "./makeDirection.js";
import { bullets, mousePos, worldObjects } from "./main.js";

export const shoot = (shooter, bullet) => {
  const direction = makeDirection(shooter, mousePos);
  bullet.vel.x = -direction.x * bullet.acc;
  bullet.vel.y = -direction.y * bullet.acc;
  bullet.xPos = shooter.xPos;
  bullet.yPos = shooter.yPos;
  console.log(bullet.vel.x);
};
