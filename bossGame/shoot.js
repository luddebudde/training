import { makeDirection } from "./makeDirection.js";
import { bullets, mousePos, worldObjects } from "./main.js";

export const shoot = (shooter) => {
  const direction = makeDirection(shooter, mousePos);

  const playerBullet = {
    xPos: shooter.xPos,
    yPos: shooter.yPos,
    radius: 15,
    vel: {
      x: -direction.x * 20,
      y: -direction.y * 20,
    },
    acc: 20,
    color: "blue",
    health: 1,
    damage: 20,
    type: "bullet",
  };

  bullets.push(playerBullet);
  worldObjects.push(playerBullet);
};
