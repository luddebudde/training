import { enemies, pickups, xps } from "../main.js";
import { makeDirection } from "../makeDirection.js";

export const createBlank = (xPos, yPos) => {
  const collector = {
    radius: 10,
    // bulletHealth: 10,
    // destroy: false,
    pos: {
      x: xPos,
      y: yPos,
    },
    color: "black",
    // team: "player",
    priority: 5,

    effect: (object) => {
      enemies.forEach((enemy) => {
        enemy.health = 0;
      });
    },
    // enemiesHit: [],
    // pierce: aimBulletStats.pierce,
    // weapon: aimBullet,
  };
  pickups.push(collector);
};
