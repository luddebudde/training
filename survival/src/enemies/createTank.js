import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import {
  enemies,
  entities,
  player,
  targetables,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playHurt } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

export const createTank = (spawnWidth, spawnHeight) => {
  const tank = {
    health: 300,
    radius: 40,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: 1 * stats.curse,
    // speed: 0,
    damage: 0.5,
    // damage: 0,
    color: "grey",
    team: "enemy",
    xp: Math.random() * 35 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(tank, player)) {
        // charger.health = 0;
        playHurt();
        // player.health -= charger.damage / (1000 / loopPerSecond);
        dealDamage(player, "contact", tank.damage);
      }

      // targetables.forEach((target) => {
      // const diff = {
      //   x: target.x - charger.x,
      //   y: target.y - charger.y,
      // };
      // const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
      // if (dist > pre)
      // });
      const target = closestObject(targetables, tank);
      // console.log(target);
      const newVel = makeDirection(tank.pos, target.pos);
      // console.log(charger.vel.x);
      tank.vel.x = newVel.x * tank.speed;
      tank.vel.y = newVel.y * tank.speed;
    },
  };

  entities.push(tank);
  enemies.push(tank);
  // worldObjects.push(charger);
};
