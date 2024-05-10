import { animation } from "../animation.js";
import { closestObject } from "../closestObject.js";
import { createSplatter } from "../createOilSplater.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  ctx,
  enemies,
  mousePos,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";
import { world } from "../world.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const flamethrowerStats = {
  fireMode: {
    area: 15,
    speed: 30,
    damage: 20,
    cooldown: 100,
    pierce: 1,
    special: 0,
  },
  oilMode: {
    area: 30,
    splatterArea: 300,
    speed: 20,
    damage: 0,
    cooldown: 100,
    pierce: 0,
    special: 0,
  },
};

function getRandomAngle() {
  return Math.random() * 360; // Slumpad vinkel mellan 0 och 360 grader
}

// Funktion för att generera slumpat avstånd från cirkelns centrum
function getRandomDistance(radius) {
  return Math.random() * 300; // Slumpat avstånd upp till cirkelns radie
}

// let previusPosDifference = {
//   pos: {
//     x: 100000000,
//     y: 100000000,
//   },
// };
// let direction = {
//   x: 0,
//   y: 0,
// };

let farthestEnemy = null;
let farthestDistanceSquared = 0;

export const burningAnimationStat = {
  imageCount: 12,
  slowDown: 10,
  reverse: false,
  repeat: true,
};

export const burningAnimation = animation({
  imageCount: burningAnimationStat.imageCount,
  slowDown: burningAnimationStat.slowDown,
  reverse: false,
  repeat: true,
  // vertical: false,
  // switchLayer: true,
  // firstLayerCount: 5,
  // layerCount: 6,
});

export const createFlamethrower = () => {
  let area;
  let speed;
  let damage;
  let cooldown;
  let pierce;
  let splatterArea = 1;
  let onHit;

  if (flamethrower.modeValue % 2 === 1) {
    //   Oil mode
    flamethrower.attackIntervall = flamethrowerStats.oilMode.cooldown;
    area = stats.area * flamethrowerStats.oilMode.area;
    speed = stats.speed * flamethrowerStats.oilMode.speed;
    damage = stats.damage * flamethrowerStats.oilMode.damage;
    cooldown = stats.cooldown * flamethrowerStats.oilMode.cooldown;
    pierce = stats.cooldown * flamethrowerStats.oilMode.pierce;
    splatterArea = stats.area * flamethrowerStats.oilMode.splatterArea;

    onHit = (enemy) => {
      enemy.statusEffects.oiled = true;
    };

    // const circleRadius = 50;

    const targetIndex = Math.floor(Math.random() * enemies.length);
    const target = enemies[targetIndex];
    const targetPos = target.pos; // Hämta pos från det slumpmässigt valda fiendeelementet

    const direction = makeDirection(targetPos, player.pos);

    const bullet = {
      radius: area,

      attackIntervall: cooldown,
      cooldown: cooldown,
      destroy: false,
      pos: {
        x: player.pos.x,
        y: player.pos.y,
      },
      vel: {
        x: -direction.x * speed,
        y: -direction.y * speed,
      },
      damage: damage,
      color: "red",
      team: "player",
      priority: 5,

      hit: () => {
        createSplatter(
          flamethrower,
          bullet.pos.x,
          bullet.pos.y,
          splatterArea,
          0,
          onHit
        );
        //   console.log("splatt!");
      },

      enemiesHit: [],
      pierce: pierce,
      weapon: flamethrower,
    };
    bullets.push(bullet);
  } else {
    // Fire mode
    flamethrower.attackIntervall = flamethrowerStats.fireMode.cooldown;
    area = stats.area * flamethrowerStats.fireMode.area;
    speed = stats.speed * flamethrowerStats.fireMode.speed;
    damage = stats.damage * flamethrowerStats.fireMode.damage;
    cooldown = stats.cooldown * flamethrowerStats.fireMode.cooldown;
    pierce = stats.cooldown * flamethrowerStats.fireMode.pierce;

    onHit = (enemy) => {
      enemy.statusEffects.oiled = false;
      enemy.statusEffects.burning = true;
    };

    // let enemyPosValue = {
    //   x: 0,
    //   y: 0,
    // };
    // // Furthest enemy
    // enemies.forEach((enemy) => {
    //   enemyPosValue.x += enemy.pos.x;
    //   enemyPosValue.y += enemy.pos.y;
    // });

    // const averageEnemyPos = {
    //   x: -enemyPosValue.x / enemies.length,
    //   y: -enemyPosValue.y / enemies.length,
    // };

    const targetIndex = Math.floor(Math.random() * enemies.length);
    const target = enemies[targetIndex];
    const targetPos = target.pos; // Hämta pos från det slumpmässigt valda fiendeelementet

    const direction = makeDirection(targetPos, player.pos);

    // console.log("Farthest enemy position:", averageEnemyPos);

    // ctx.beginPath();
    // ctx.arc(
    //   targetPos.x + world.width / 2 - player.pos.x,
    //   targetPos.y + world.height / 2 - player.pos.y,
    //   100,
    //   0,
    //   2 * Math.PI
    // );
    // ctx.fillStyle = "green";
    // ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(world.width / 2, world.height / 2); // Flytta startpunkten till spelarens position
    ctx.lineTo(
      targetPos.x + world.width / 2 - player.pos.x,
      targetPos.y + world.height / 2 - player.pos.y
    ); // Dra linjen till fiendens position
    ctx.strokeStyle = "blue"; // Färg för linjen
    ctx.stroke(); // Rita linjen

    requestAnimationFrame(flameThrowerFire);

    const bullet = {
      radius: area,

      attackIntervall: cooldown,
      cooldown: cooldown,
      destroy: false,
      pos: {
        x: player.pos.x,
        y: player.pos.y,
      },
      vel: {
        x: -direction.x * speed,
        y: -direction.y * speed,
      },
      damage: damage,
      color: "red",
      team: "player",
      priority: 5,

      hit: () => {
        createSplatter(
          flamethrower,
          bullet.pos.x,
          bullet.pos.y,
          splatterArea,
          0,
          onHit
        );
        //   console.log("splatt!");
      },

      enemiesHit: [],
      pierce: pierce,
      weapon: flamethrower,
    };
    bullets.push(bullet);
  }
};

const flameThrowerFire = () => {
  const chosenIndex = Math.floor(Math.random() * enemies.length);
  const chosenEnemy = enemies[chosenIndex];
  ctx.drawImage(
    assets.blue,
    0,
    0,
    665,
    665,
    world.width / 2,
    world.height / 2,
    chosenEnemy.pos.x,
    chosenEnemy.pos.y
  );
  console.log("blueblue!!");
  requestAnimationFrame(flameThrowerFire);
};

export const flamethrower = {
  name: "flamethrower",
  timesTaken: 0,
  unlockRequirement: () => {},
  // image: assets.rhino,
  image: await loadImage(`public/sprites/aimBulletSprite.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: flamethrowerStats.oilMode.cooldown * stats.cooldown,
  cooldown: flamethrowerStats.oilMode.cooldown * stats.cooldown,
  attack: createFlamethrower,

  update: () => {
    flamethrowerStats.attackIntervall =
      flamethrowerStats.oilMode.cooldown * stats.cooldown;
  },

  modeValue: 0,

  stats: flamethrowerStats,

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  upgrades: {
    level: 0,
    statsOrder: [
      ["cooldown", "speed"],
      ["speed"],
      ["damage"],
      ["area"],
      ["speed"],
      ["special"],
    ],
    amountOrder: [[-10, 5], [1], [1], [5], [5], [1]],

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
