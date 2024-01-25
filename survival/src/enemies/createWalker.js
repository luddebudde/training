import { animation } from "../animation.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, entities, player, worldObjects } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const walkerAnimations = animation({
  imageCount: 9,
  slowDown: 4,
  reverse: false,
  repeat: true,
});

export const createWalker = (spawnWidth, spawnHeight) => {
  const walker = {
    health: 100,
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
    damage: 10,
    // damage: 0,
    color: "red",
    team: "enemy",
    xp: Math.random() * 50 * stats.growth,
    priority: 10,

    update: () => {
      const newVel = makeDirection(walker.pos, player.pos);
      // console.log(makeDirection(walker, player));
      walker.vel.x = newVel.x * walker.speed;
      walker.vel.y = newVel.y * walker.speed;
      if (doCirclesOverlap(walker, player)) {
        walker.health = 0;
        player.health -= walker.damage;
      }
    },
    draw: (ctx, assets, gameObject) => {
      // walkerAnimations.step();
      // walkerAnimations.draw(
      //   ctx,
      //   assets.jet,
      //   walker.pos.x,
      //   walker.pos.y,
      //   walker.radius * 2,
      //   walker.radius
      // );

      ctx.drawImage(
        assets.blue,
        walker.pos.x,
        walker.pos.y,
        // 100,
        // 100,
        walker.radius * 2,
        walker.radius * 2
      );
      // console.log("bild", assets.rhino, "walker pos", walker.pos);
      // }
      //  else {
      //   ctx.drawImage(
      //     assets.astronaut,
      //     -body.circleRadius * 0.5,
      //     -body.circleRadius * 1.5 * 0.5,
      //     body.circleRadius,
      //     body.circleRadius * 1.5
      //   );
      // }
    },
  };

  entities.push(walker);
  enemies.push(walker);
  worldObjects.push(walker);
};
