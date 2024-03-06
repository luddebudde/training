import { pickups, xps } from "../main.js";
import { makeDirection } from "../makeDirection.js";

export const createCollector = (xPos, yPos) => {
  const collector = {
    radius: 10,
    // bulletHealth: 10,
    // destroy: false,
    pos: {
      x: xPos,
      y: yPos,
    },
    color: "blue",
    // team: "player",
    priority: 5,

    effect: (object) => {
      xps.forEach((xp) => {
        const newDirection = makeDirection(xp.pos, object.pos);

        xp.vel.x = newDirection.x * 10;
        xp.vel.y = newDirection.y * 10;
      });
    },
    // enemiesHit: [],
    // pierce: aimBulletStats.pierce,
    // weapon: aimBullet,
  };
  pickups.push(collector);
};
