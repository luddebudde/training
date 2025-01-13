import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { Enemy } from "../enemies/chaser";
import { goTo } from "../goTo";
import { makeDirection } from "../makeDirection";
import { add, mult, multVar, sub, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const cornerDelay = 50;
const health = 15;

export const createChargerBoss = () => {
  const charger = {
    maxHealth: health,
    health: health,
    contactDamage: 60,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 120,
    color: "purple",
    speed: 50,
    team: "enemy",
    mass: 1000,

    // Pahses
    phaseCounter: 100,

    aiMovement: () => {},
    update: (ctx): void => {
      charger.aiMovement();

      charger.phaseCounter--;

      if (charger.phaseCounter < 0) {
        charger.airFriction = false;
        const direction = makeDirection(charger.pos, player.pos);

        charger.vel = multVar(direction, charger.speed);

        charger.phaseCounter = 10000;
      }
    },
    deathAnimation: (ctx, liveBosses, bossIndex) => {
      // console.log("death aniamtion: ACTIVATE");
      // //   const maxI = 200; // Antal kulor
      // //   const angleStep = (Math.PI * 2) / maxI; // Steg mellan vinklar för att täcka en cirkel
      // //   const speed = 50; // Hastighet för kulorna
      // const decreaseAmount = 1.5;
      // charger.phaseCounter = 10000;
      // for (let i = 0; i < charger.radius; i++) {
      //   setTimeout(() => {
      //     if (charger.radius > 1) {
      //       // if (i < (charger.radius / decreaseAmount) * 0.5) {
      //       // charger.radius += decreaseAmount;
      //       //   return;
      //       // }
      //       // console.log("fdearing");
      //       charger.radius -= decreaseAmount;
      //       console.log(charger);
      //     } else {
      //       console.log("sml");
      //       return;
      //     }
      //     ctx.beginPath();
      //     ctx.arc(charger.pos.x, charger.pos.y, charger.radius, 0, 2 * Math.PI);
      //     ctx.fillStyle = charger.color;
      //     ctx.fill();
      //   }, 10 * i);
      // }
    },
    onWallBounce: () => {
      //   charger.vel = { x: 0, y: 0 };
      charger.airFriction = true;

      charger.phaseCounter = 100;
    },
    airFriction: false,
  };

  return charger;
  // entities.push(sprayer);
  // liveBosses.push(sprayer);
};
