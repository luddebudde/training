import { animation } from "./animation.js";
import { assets, explosions, worldObjects } from "./main.js";

export const createExplosion = (
  weapon,
  locX,
  locY,
  size,
  damage,
  speed = 16,
  sprite = assets.explosion
) => {
  const explosionAnimation = animation({
    imageCount: 7,
    slowDown: speed,
    reverse: false,
    repeat: false,
  });

  const explosion = {
    weapon: weapon,
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
        explosion.pos.x - explosion.radius / 1.2,
        explosion.pos.y - explosion.radius / 2,
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
