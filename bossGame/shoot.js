import { makeDirection } from "./makeDirection.js";
import { bullets, mousePos, worldObjects } from "./main.js";

export const shoot = (shooter, bullet) => {
  bullets.push(bullet);
  worldObjects.push(bullet);
  const direction = makeDirection(shooter, mousePos);
  bullet.vel.x = -direction.x * bullet.acc;
  bullet.vel.y = -direction.y * bullet.acc;
  bullet.xPos = shooter.xPos;
  bullet.yPos = shooter.yPos;
};
