import { bullets, player } from "../main.js";
import { stats } from "../stats.js";

export const createEnemyBullet = (
  shooter,
  direction,
  { area, speed, damage, asset, isAnimation = false, assetInfo }
) => {
  const bullet = {
    radius: area,
    destroy: false,
    pos: {
      x: shooter.pos.x,
      y: shooter.pos.y,
    },
    vel: {
      x: direction.x * speed,
      y: direction.y * speed,
    },
    knockback: 0,
    damage: damage,
    color: "red",
    team: "enemy",
    priority: 5,
    enemiesHit: [],
    pierce: 0,
    draw: (ctx, assets, gameObject) => {
      if (!isAnimation) {
        const angle = Math.atan2(bullet.vel.y, bullet.vel.x);
        ctx.save();
        ctx.translate(bullet.pos.x, bullet.pos.y);
        ctx.rotate(angle);
        ctx.drawImage(
          asset,
          -bullet.radius,
          -bullet.radius,
          bullet.radius * 2,
          bullet.radius * 2
        );
        ctx.restore();
      } else {
        assetInfo.step();
        assetInfo.draw(
          ctx,
          asset,
          bullet.pos.x - bullet.radius / 1.2,
          bullet.pos.y - bullet.radius / 2,
          bullet.radius * 2,
          bullet.radius
        );
        const stepInfo = assetInfo.step();

        if (stepInfo) {
          bullet.hasExpired = true;
        }
      }
    },
  };
  bullets.push(bullet);
};
