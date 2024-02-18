import { loopPerSecond } from "../basic.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, entities, player, worldObjects } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playHurt } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

export const createCharger = (spawnWidth, spawnHeight) => {
  const charger = {
    health: 10,
    radius: 40,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: 5 * stats.curse,
    // speed: 0,
    damage: 0.5,
    // damage: 0,
    color: "black",
    team: "enemy",
    xp: Math.random() * 25 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(charger, player)) {
        // charger.health = 0;
        playHurt();
        // player.health -= charger.damage / (1000 / loopPerSecond);
        dealDamage(player, "contact", charger.damage);
      }

      const newVel = makeDirection(charger.pos, player.pos);
      // console.log(charger.vel.x);
      charger.vel.x = newVel.x * charger.speed;
      charger.vel.y = newVel.y * charger.speed;
    },
  };

  entities.push(charger);
  enemies.push(charger);
  // worldObjects.push(charger);
};
