import { animation } from "./animation.js";
import { assets, areaEffects, worldObjects } from "./main.js";

export const createSplatter = (
  weapon,
  locX,
  locY,
  size,
  damage,
  onHit,
  speed = 16,
  sprite = assets.explosion
) => {
  const splatterAnimation = animation({
    imageCount: 7,
    slowDown: speed,
    reverse: false,
    repeat: false,
  });

  const splatter = {
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
      splatterAnimation.step();
      splatterAnimation.draw(
        ctx,
        sprite,
        splatter.pos.x - splatter.radius / 1.2,
        splatter.pos.y - splatter.radius / 2,
        splatter.radius * 2,
        splatter.radius
      );
      const stepInfo = splatterAnimation.step();

      if (stepInfo) {
        splatter.hasExpired = true;
      }
    },
    onHit: (splatter, enemy) => {
      //   console.log("spaltt");
      onHit(enemy);

      //   console.log(enemy.statusEffects);
    },
  };

  areaEffects.push(splatter);
};
