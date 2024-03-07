import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { drawText } from "../draw/drawText.js";
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

export const createJuggernaut = (spawnWidth, spawnHeight) => {
  const juggernaut = {
    health: 800,
    radius: 45,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: 0.75 * stats.curse,
    // speed: 0,
    damage: 1 * stats.curse,
    // damage: 0,
    color: "purple",
    team: "enemy",
    xp: Math.random() * 10 * stats.growth,
    priority: 10,

    update: () => {
      drawText(juggernaut.health, juggernaut.pos.x + 10, juggernaut.pos.y + 30);
      if (doCirclesOverlap(juggernaut, player)) {
        // charger.health = 0;
        playHurt();
        // player.health -= charger.damage / (1000 / loopPerSecond);
        dealDamage(player, "contact", juggernaut.damage);
      }

      const newVel = makeDirection(juggernaut.pos, player.pos);
      juggernaut.vel.x = newVel.x * juggernaut.speed;
      juggernaut.vel.y = newVel.y * juggernaut.speed;
    },
    hit: () => {
      if (Math.random() > 0.95) {
        juggernaut.health += 200;
      }
    },
  };

  entities.push(juggernaut);
  enemies.push(juggernaut);
  // worldObjects.push(charger);
};
