import { bullets, mousePos, moveCtx, player, worldObjects } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20 * stats.speed;
const cooldown = 25;

export const createAimBullet = () => {
  const realMousPos = vector.eachOther.sub(mousePos, moveCtx);

  const direction = makeDirection(
    player.pos,
    // vector.add(mousePos, realMousPos)
    realMousPos
  );
  // console.log(direction);
  const bullet = {
    radius: 20 * stats.area,
    // bulletHealth: 10,
    attackIntervall: cooldown,
    cooldown: cooldown,
    destroy: false,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: direction.x * bulletSpeed,
      y: direction.y * bulletSpeed,
    },
    damage: 20 * stats.damage,
    color: "blue",
    team: "player",
    priority: 5,

    attack: () => {
      bullets.push(bullet);
      worldObjects.push(bullet);
    },
  };
  bullets.push(bullet);
  worldObjects.push(bullet);
};

export const aimBullet = {
  newCooldown: cooldown * stats.cooldown,
  attackIntervall: cooldown * stats.cooldown,
  cooldown: cooldown * stats.cooldown,
  attack: createAimBullet,
};
