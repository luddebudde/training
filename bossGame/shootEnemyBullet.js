import { bullets, worldObjects } from "./main.js";

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
      x: velX,
      y: velY,
    },
    damage: bulletDamage,
    // health: 1,
    radius: bulletRadius,
    color: bulletColor,
    type: "bullet",
    team: "enemy",
    destroy: false,
  };

  bullets.push(enemyBullet);
  worldObjects.push(enemyBullet);
};
