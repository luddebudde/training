import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  mousePos,
  moveCtx,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const aimBulletStats = {
  area: 20,
  speed: 20,
  damage: 20,
  cooldown: 12,
  special: 0,
};

function getRandomAngle() {
  return Math.random() * 360; // Slumpad vinkel mellan 0 och 360 grader
}

// Funktion för att generera slumpat avstånd från cirkelns centrum
function getRandomDistance(radius) {
  return Math.random() * 300; // Slumpat avstånd upp till cirkelns radie
}

export const createRandomAimBullet = () => {
  // console.log(aimBullet.area);
  const area = stats.area * aimBulletStats.area;
  const speed = stats.speed * aimBulletStats.speed;
  const damage = stats.damage * aimBulletStats.damage;
  const cooldown = stats.cooldown * aimBulletStats.cooldown;

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
  const bullet = {
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

    attack: () => {
      bullets.push(bullet);
      // worldObjects.push(bullet);
    },
  };
  bullets.push(bullet);
  // worldObjects.push(bullet);

  // return cooldown;
};

export const randomAimBullet = {
  name: "randomAimBullet",
  // image: assets.rhino,
  image: await loadImage(`/public/sprites/aimBulletSprite.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: aimBulletStats.cooldown * stats.cooldown,
  cooldown: aimBulletStats.cooldown * stats.cooldown,
  attack: createRandomAimBullet,

  update: () => {
    randomAimBullet.attackIntervall = aimBulletStats.cooldown * stats.cooldown;
  },

  stats: aimBulletStats,

  upgrades: {
    level: 0,
    statsOrder: ["cooldown", "speed", "damage", "area", "speed", "special"],
    amountOrder: [-10, 1, 1, 5, 5, 1],
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
