import { animation } from "./animation.js";
import { dealDamage } from "./dealDamage.js";
import { assets, areaEffects, worldObjects } from "./main.js";

export const createExplosion = (
  weapon,
  locX,
  locY,
  size,
  damage,
  speed = 16,
  sprite = assets.explosion,
  team = "player"
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
    team: team,
    radius: size,
    hasExpired: false,
    damage: damage,
    draw: (ctx, assets, object) => {
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
    onHit: (explosion, enemy) => {
      dealDamage(enemy, "explosion", explosion.damage, explosion.weapon);
    },
  };

  areaEffects.push(explosion);
};
