import { animation } from "../animation.js";
import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { getRandomSpawnPos } from "../getRandomSpawnPos.js";
import {
  bosses,
  enemies,
  entities,
  player,
  targetables,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playHurt, playMinigunOverheat } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";
import { world } from "../world.js";
import { createMarcher } from "./createMarcher.js";

const marcherAnimation = animation({
  imageCount: 4,
  slowDown: 9,
  reverse: false,
  repeat: true,
});

const spreadAngle = Math.PI / 6; // Justera spridningsvinkeln efter behov
const numShots = 5; // Justera antalet skott efter behov

let atWorldEdge = true;

export const createMarcherBoss = (
  spawnWidth = getRandomSpawnPos(player).x,
  spawnHeight = getRandomSpawnPos(player).y
) => {
  console.log("marcher");
  const marcherSpawnPos = {
    x: spawnWidth,
    y: spawnHeight,
  };
  const MarcherSpeed = 20 * stats.curse;
  // const newVel = makeDirection(marcherSpawnPos, player.pos);

  const marcher = {
    health: 1000,
    radius: 100,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: 1 * stats.curse,

    damage: 5,

    color: "red",
    team: "enemy",
    xp: Math.random() * 500 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(marcher, player)) {
        playHurt();
        dealDamage(player, "contact", marcher.damage);
      }

      if (marcher.pos.x < player.pos.x - world.width / 2) {
        atWorldEdge = true;
      } else if (marcher.pos.x > world.width / 2 + player.pos.x) {
        atWorldEdge = true;
      }

      if (marcher.pos.y < player.pos.y - world.height / 2) {
        atWorldEdge = true;
      } else if (marcher.pos.y > world.height / 2 + player.pos.y) {
        atWorldEdge = true;
      }

      if (atWorldEdge === true) {
        const newVel = makeDirection(marcher.pos, player.pos);

        marcher.vel.x = newVel.x * MarcherSpeed;
        marcher.vel.y = newVel.y * MarcherSpeed;
        atWorldEdge = false;

        for (let i = 0; i < numShots; i++) {
          const angleOffset = (i - (numShots - 1) / 2) * spreadAngle;
          const angle = Math.atan2(newVel.y, newVel.x) + angleOffset;
          const direction = {
            x: Math.cos(angle),
            y: Math.sin(angle),
          };

          // console.log(angle);
          createMarcher(marcher.pos.x, marcher.pos.y, direction);
        }
      }
    },
    draw: (ctx, assets, gameObject) => {
      // ctx.drawImage(
      //   assets.blue,
      //   marcher.pos.x - marcher.radius,
      //   marcher.pos.y - marcher.radius,
      //   // 100,
      //   // 100,
      //   marcher.radius * 2,
      //   marcher.radius * 2
      // );
      marcherAnimation.step();
      marcherAnimation.draw(
        ctx,
        assets.marcher,
        marcher.pos.x - marcher.radius / 1.2,
        marcher.pos.y - marcher.radius / 2,
        marcher.radius * 2,
        marcher.radius
      );
      const stepInfo = marcherAnimation.step();

      if (stepInfo) {
        marcher.hasExpired = true;
      }
    },
    ability: () => {
      // const direction = makeDirection(marcher.pos, player.pos);
      // player.pos.x -= direction.x * 1;
      // player.pos.y -= direction.y * 1;
    },
  };

  entities.push(marcher);
  enemies.push(marcher);
  bosses.push(marcher);
  // worldObjects.push(walker);
};
