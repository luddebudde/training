import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, player, worldObjects } from "../main.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20;
const cooldown = 25;

export const createHolyArea = () => {
  const holyAreaBody = {
    radius: 300 * stats.area,
    bulletHealth: 10,
    attackIntervall: cooldown,
    cooldown: cooldown,
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      x: 0,
      y: 0,
    },
    damage: 20,
    color: "green",
    team: "player",
    priority: 1,
  };

  return holyAreaBody;
};

export const holyAreaBody = createHolyArea();

export const holyArea = {
  name: "holyArea",
  attackIntervall: cooldown,
  cooldown: cooldown,
  attack: () => {
    enemies.forEach((enemy) => {
      //   if (doCirclesOverlap(holyAreaBody, enemy)) {
      //     const aVel = enemy.vel;
      //     enemy.vel = vector.alone.div(enemy.vel, 2);
      //     console.log(aVel, enemy.vel);
      //   }
    });
  },
  update: () => {
    holyAreaBody.pos = player.pos;
  },
  body: holyAreaBody,
};
