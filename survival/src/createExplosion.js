import { animation } from "./animation.js";
import { assets, explosions, worldObjects } from "./main.js";

export const createExplosion = (
  locX,
  locY,
  size,
  speed,
  damage,
  sprite = assets.explosion
) => {
  const explosionAnimation = animation({
    imageCount: 7,
    slowDown: speed,
    reverse: false,
    repeat: false,
  });

  const explosion = {
    pos: {
      x: locX,
      y: locY,
    },
    radius: size,
    hasExpired: false,
    damage: damage,
    draw: (ctx, assets, object) => {
      //   console.log(explosion);
      //   ctx.drawImage(sprite, explosion.pos.x, explosion.pos.y, size, size);
      explosionAnimation.step();
      explosionAnimation.draw(
        ctx,
        sprite,
        explosion.pos.x,
        explosion.pos.y,
        explosion.radius * 2,
        explosion.radius
      );
      const stepInfo = explosionAnimation.step();

      if (stepInfo) {
        explosion.hasExpired = true;
      }
    },
  };

  explosions.push(explosion);
};
