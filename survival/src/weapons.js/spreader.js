import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  enemies,
  mousePos,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const randomAimBulletStats = {
  area: 20,
  speed: 20,
  damage: 20,
  cooldown: 12,
  pierce: 0,
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
  const area = stats.area * randomAimBulletStats.area;
  const speed = stats.speed * randomAimBulletStats.speed;
  const damage = stats.damage * randomAimBulletStats.damage;
  const cooldown = stats.cooldown * randomAimBulletStats.cooldown;

  let direction;

  // if (randomAimBulletStats.special === 0) {
  const circleRadius = 50;

  const randomAngle = getRandomAngle();
  const randomDistance = getRandomDistance(area);

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

  direction = makeDirection(stopPos, player.pos);
  // }
  //  else {
  //   const targetIndex = Math.floor(Math.random() * enemies.length);
  //   const target = enemies[targetIndex];
  //   const targetPos = target.pos; // Hämta pos från det slumpmässigt valda fiendeelementet

  //   direction = makeDirection(targetPos, player.pos);
  //   direction = {
  //     x: -direction.x,
  //     y: -direction.y,
  //   };
  // }
  const bullet = {
    // bulletStopPos: stopPos,
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
    pierce: randomAimBulletStats.pierce,
    weapon: randomAimBullet,
  };
  bullets.push(bullet);
};

export const randomAimBullet = {
  name: "spreader",
  timesTaken: 0,
  unlockRequirement: () => {},
  // image: assets.rhino,
  image: await loadImage(`public/sprites/aimBulletSprite.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: randomAimBulletStats.cooldown * stats.cooldown,
  cooldown: randomAimBulletStats.cooldown * stats.cooldown,
  attack: createRandomAimBullet,

  update: () => {
    randomAimBullet.attackIntervall =
      randomAimBulletStats.cooldown * stats.cooldown;
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: randomAimBulletStats,

  upgrades: {
    level: 5,
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
