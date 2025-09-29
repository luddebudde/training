import { bullets, worldObjects } from "./main.js";
import { world } from "./world.js";

let bulletSpeed;

export const shootEnemyBullet = (
  startPosX,
  startPosY,
  velX,
  velY,
  bulletDamage,
  bulletRadius,
  bulletColor
) => {
  const enemyBullet = {
    xPos: startPosX,
    yPos: startPosY,
    vel: {
      x: world.width / (1200 / velX),
      y: world.width / (1200 / velY),
    },
    damage: bulletDamage,
    // health: 1,
    radius: world.width / (1200 / bulletRadius),
    // radius: bulletRadius,
    color: bulletColor,
    type: "bullet",
    team: "enemy",
    destroy: false,
  };
  // console.log(enemyBullet.vel);

  bullets.push(enemyBullet);
  worldObjects.push(enemyBullet);
};
