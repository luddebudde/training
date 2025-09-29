import { animation } from "./animation.js";
import { assets, areaEffects, worldObjects } from "./main.js";

export const createSplatter = (
  weapon,
  locX,
  locY,
  size,
  damage,
  onHit,
  splatterInfo,
  speed = 16,
  sprite = assets.explosion,
  vertical = true,
  team = "player"
) => {
  const splatterAnimation = animation({
    imageCount: splatterInfo.imageCount,
    slowDown: splatterInfo.slowDown,
    reverse: splatterInfo.reverse,
    repeat: splatterInfo.repeat,
    vertical: splatterInfo.vertical,
    // imageCount: 7,
    // slowDown: 20,
    // reverse: false,
    // repeat: false,
    // vertical: true,
  });

  const splatter = {
    weapon: weapon,
    pos: {
      x: locX,
      y: locY,
    },
    team: team,
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
      onHit(enemy);
    },
  };

  areaEffects.push(splatter);
};
