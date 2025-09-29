import { loopPerSecond } from "../basic.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import {
  blankImmune,
  bullets,
  enemies,
  player,
  worldObjects,
  xps,
} from "../main.js";
import { playScreecher, playWiper } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

// const bulletSpeed = 20;
// const cooldown = 500;

const screecherStats = {
  area: 0,
  speed: 0,
  damage: 0,
  cooldown: loopPerSecond * 5,
  fear: 30,

  special: 0,
  applyEffect: {},
  specialStats: {
    area: 20,
    damage: 10,
    knockback: 0,
    pierce: 3,
  },
};

// export const createScreech = () => {
//   const area = stats.area * wiperStats.area;
//   // const speed = stats.speed + holyAreaStats.speed;
//   // const damage = stats.damage + holyAreaStats.damage;

//   const wiperBullet = {
//     radius: 1 * area,
//     // bulletHealth: 10,
//     attackIntervall: cooldown,
//     cooldown: cooldown,
//     pos: {
//       x: 0,
//       y: 0,
//     },
//     vel: {
//       x: 0,
//       y: 0,
//     },
//     damage: 9999,
//     color: "green",
//     team: "player",
//     priority: 1,
//   };

//   return wiperBullet;
// };

// export const wiperBody = createScreech();
const createScreechBullet = (enemy) => {
  const screecherBullet = {
    radius: screecherStats.specialStats.area,
    destroy: false,
    pos: {
      x: enemy.pos.x,
      y: enemy.pos.y,
    },
    vel: {
      x: 0,
      y: 0,
    },
    damage: screecherStats.specialStats.damage,
    knockback: screecherStats.specialStats.knockback,
    color: "blue",
    team: "player",
    priority: 5,

    enemiesHit: [],
    pierce: screecherStats.specialStats.pierce,
    weapon: screecher,
  };
  bullets.push(screecherBullet);
};

export const screecher = {
  name: "screecher",
  timesTaken: 0,
  unlockRequirement: () => {},
  attackIntervall: screecherStats.cooldown,
  cooldown: screecherStats.cooldown,
  attack: () => {
    playScreecher();

    enemies.forEach((enemy) => {
      enemy.statusEffects.courage -= screecherStats.fear;

      if (enemy.statusEffects.courage <= 0) {
        enemy.fearMult = -3;

        if (screecherStats.special > 0) {
          // Spara den ursprungliga update-funktionen
          const originalUpdate = enemy.update;

          enemy.screechCounter = 0;

          enemy.health = 99999;

          // Ersätt update-funktionen med en ny funktion
          enemy.update = function () {
            // Lägg till dina nya rader med kod här
            console.log("Special behavior code here");

            if (enemy.screechCounter % loopPerSecond === 0) {
              // enemy.health += screecherStats.specialStats.damage;
              createScreechBullet(enemy);
            }

            // Anropa den ursprungliga update-funktionen
            originalUpdate.apply(this, arguments);

            enemy.screechCounter++;
            // Du kan också lägga till kod efter den ursprungliga funktionen om det behövs
          };
        }
      }
    });
  },

  update: () => {
    screecher.attackIntervall = screecherStats.cooldown * stats.cooldown;
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: screecherStats,

  upgrades: {
    level: 0,
    statsOrder: [
      ["cooldown"],
      ["fear"],
      ["cooldown"],
      ["fear"],
      ["cooldown", "fear"],
      ["special"],
    ],
    amountOrder: [
      [-loopPerSecond * 3],
      [20],
      [-loopPerSecond * 2],
      [30],
      [-loopPerSecond * 2.5, 70],
      [1],
    ],
    description: [
      "Decreases the cooldown",
      "Kill",
      "Decreases the cooldown even more",
      "Xp",
      "Kill",
      "Adds special ability",
    ],
  },

  // body: wiperBody,
};
