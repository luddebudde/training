import { bullets } from "../main.js";
import { stats } from "../stats.js";

export const createEnemyBullet = (
  shooter,
  direction,
  { area, speed, damage }
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
    damage: damage,
    color: "red",
    team: "enemy",
    priority: 5,
    enemiesHit: [],
    pierce: 0,
  };
  bullets.push(bullet);
};
