import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, player, worldObjects } from "../main.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20;
const cooldown = 25;

export const createHolyArea = () => {
  const holyAreaBody = {
    radius: 300,
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
  };

  return holyAreaBody;
};

export const holyAreaBody = createHolyArea();

export const holyArea = {
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
};
