import { makeDirection } from "./makeDirection.js";
import { bullets, mousePos, worldObjects } from "./main.js";
import { world } from "./world.js";

const bulletSpeed = 40;

export const shoot = (shooter) => {
  const direction = makeDirection(shooter, mousePos);

  const playerBullet = {
    xPos: shooter.xPos,
    yPos: shooter.yPos,
    radius: world.width / 80,
    vel: {
      x: -direction.x * (world.width / (1200 / bulletSpeed)),
      y: -direction.y * (world.width / (1200 / bulletSpeed)),
    },
    acc: 20,
    color: "blue",
    // health: 1,
    damage: 20,
    type: "bullet",
    team: "player",
    destroy: false,
  };

  // console.log(world.width / (world.width / bulletSpeed));

  bullets.push(playerBullet);
  worldObjects.push(playerBullet);
};
