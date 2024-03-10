import { animation } from "../animation.js";
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
import { playHurt, playMinigunOverheat } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const marcherAnimation = animation({
  imageCount: 4,
  slowDown: 9,
  reverse: false,
  repeat: true,
});

export const createMarcher = (
  spawnWidth,
  spawnHeight,
  direction = undefined
) => {
  const marcherSpawnPos = {
    x: spawnWidth,
    y: spawnHeight,
  };
  // console.log("hej");
  const MarcherSpeed = 10 * stats.curse;

  const newVel = makeDirection(marcherSpawnPos, player.pos);

  // console.log(newVel)s;

  const marcher = {
    health: 100,
    radius: 50,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x:
        direction === undefined
          ? newVel.x * MarcherSpeed
          : direction.x * MarcherSpeed,
      y:
        direction === undefined
          ? newVel.y * MarcherSpeed
          : direction.y * MarcherSpeed,
    },
    speed: 2 * stats.curse,

    damage: 0.4,

    color: "red",
    team: "enemy",
    xp: Math.random() * 50 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(marcher, player)) {
        playHurt();
        dealDamage(player, "contact", marcher.damage);
      }
    },
    draw: (ctx, assets, gameObject) => {
      // ctx.drawImage(
      //   assets.marcher,
      //   marcher.pos.x - marcher.radius,
      //   marcher.pos.y - marcher.radius,

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
  };

  entities.push(marcher);
  enemies.push(marcher);
};
