import { createExplosion } from "../createExplosion.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  mousePos,
  player,
  targetables,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const cherryStats = {
  area: 20,
  speed: 1,
  damage: 20,
  cooldown: 400,
  pullForceBonus: 0,
  //   pierce: 0,
  special: 0,
  lifetime: 500,
};

function getRandomAngle() {
  return Math.random() * 360; // Slumpad vinkel mellan 0 och 360 grader
}

// Funktion för att generera slumpat avstånd från cirkelns centrum
function getRandomDistance(radius) {
  return Math.random() * 300; // Slumpat avstånd upp till cirkelns radie
}

export const createCherry = () => {
  // console.log(aimBullet.area);
  const area = stats.area * cherryStats.area;
  const speed = stats.speed * cherryStats.speed;
  const damage = stats.damage * cherryStats.damage;
  const cooldown = stats.cooldown * cherryStats.cooldown;

  // Ange cirkelns radie
  const circleRadius = 50;

  // Generera slumpad vinkel och avstånd
  const randomAngle = getRandomAngle();
  const randomDistance = getRandomDistance(area);

  // Beräkna slumpad position i cirkeln

  const stopPos = {
    x:
      circleRadius +
      randomDistance * Math.cos((randomAngle * Math.PI) / 180) +
      player.pos.x,
    y:
      circleRadius +
      randomDistance * Math.sin((randomAngle * Math.PI) / 180) +
      player.pos.y,
  };

  const direction = makeDirection(stopPos, player.pos);

  //   console.log("Slumpad vinkel:", randomAngle);
  //   console.log("Slumpat avstånd:", randomDistance);
  // console.log("Slumpad position i cirkeln:", { x, y });
  // console.log(direction);

  // console.log(direction);
  const cherryBullet = {
    lifetime: cherryStats.lifetime,
    bulletStopPos: stopPos,
    radius: area,
    // bulletHealth: 10,
    attackIntervall: cooldown,
    cooldown: cooldown,
    destroy: false,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: direction.x * speed,
      y: direction.y * speed,
    },
    damage: damage,
    color: "green",
    team: "player",
    priority: 5,
    enemiesHit: [],
    // pierce: cherryStats.pierce,
    weapon: cherry,
    pullForceBonus: cherryStats.pullForceBonus,
    update: (index) => {
      cherryBullet.lifetime--;

      if (cherryBullet.lifetime <= 0) {
        createExplosion(
          cherry,
          cherryBullet.pos.x,
          cherryBullet.pos.y,
          100,
          100
        );
        targetables.splice(index, 1);
      }
    },
  };
  //   bullets.push(cherryBullet);
  targetables.push(cherryBullet);
  // worldObjects.push(bullet);

  // return cooldown;
};

export const cherry = {
  name: "cherry",
  // image: assets.rhino,
  image: await loadImage(`/public/sprites/aimBulletSprite.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: cherryStats.cooldown * stats.cooldown,
  cooldown: cherryStats.cooldown * stats.cooldown,
  attack: createCherry,

  update: () => {
    cherry.attackIntervall = cherryStats.cooldown * stats.cooldown;
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: cherryStats,

  upgrades: {
    level: 0,

    statsOrder: [
      ["cooldown"],
      ["speed"],
      ["damage"],
      ["area"],
      ["speed"],
      ["special"],
    ],
    amountOrder: [[-6], [1], [1], [5], [5], [1]],
    description: [
      "Decreases the cooldown between each shot",
      "Increases the speed",
      "Increases the damage",
      "Increases the area",
      "Increases the speed even further",
      "Adds special ability",
    ],
  },
};