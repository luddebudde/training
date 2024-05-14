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
let currentTarget;
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

const flameThrowerAnimation = {
  oil: {
    imageCount: 7,
    slowDown: 20,
    reverse: false,
    repeat: false,
    vertical: true,
  },
  fire: {
    imageCount: 24,
    slowDown: 20,
    reverse: false,
    repeat: false,
    vertical: false,
  },
};

function getRandomAngle() {
  return Math.random() * 360;
}

function getRandomDistance(radius) {
  return Math.random() * 300;
}

let farthestEnemy = null;
let farthestDistanceSquared = 0;

export const burningAnimationStat = {
  imageCount: 12,
  slowDown: 10,
  reverse: false,
  repeat: true,
};
export const flameAnimationStat = {
  imageCount: 24,
  slowDown: 10,
  reverse: false,
  repeat: true,
  vertical: false,
};

export const burningAnimation = animation({
  imageCount: burningAnimationStat.imageCount,
  slowDown: burningAnimationStat.slowDown,
  reverse: false,
  repeat: true,
});

export let flameAnimation = animation({
  imageCount: flameAnimationStat.imageCount,
  slowDown: flameAnimationStat.slowDown,
  reverse: false,
  repeat: false,
  vertical: false,
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
          onHit,
          flameThrowerAnimation.oil
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

    const targetIndex = Math.floor(Math.random() * enemies.length);
    const target = enemies[targetIndex];
    const targetPos = target.pos; // Hämta pos från det slumpmässigt valda fiendeelementet

    const direction = makeDirection(targetPos, player.pos);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(world.width / 2, world.height / 2); // Flytta startpunkten till spelarens position
    ctx.lineTo(
      targetPos.x + world.width / 2 - player.pos.x,
      targetPos.y + world.height / 2 - player.pos.y
    ); // Dra linjen till fiendens position
    ctx.strokeStyle = "blue"; // Färg för linjen
    ctx.stroke(); // Rita linjen

    // currentTarget = target;
    // console.log(currentTarget);
    flameThrowerFire();

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
          onHit,
          flameThrowerAnimation.fire
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

let chosenIndex;
let chosenEnemy;
let chosenPos;

const flameThrowerFire = () => {
  // console.log(chosenEnemy);

  if (chosenPos === undefined) {
    const chosenIndex = Math.floor(Math.random() * enemies.length);
    const chosenEnemy = enemies[chosenIndex];
    chosenPos = { x: chosenEnemy.pos.x, y: chosenEnemy.pos.y }; // Skapa en klon av fiendens position

    // console.log(chosenEnemy);
    // chosenPos = { x: 100, y: 100 };
  }

  // console.log(chosenEnemy.pos);
  console.log();

  flameAnimation.step();
  // ctx.drawImage(
  //   assets.blue,
  //   0,
  //   0,
  //   665,
  //   665,
  //   world.width / 2,
  //   world.height / 2,
  //   chosenEnemy.pos.x,
  //   chosenEnemy.pos.y
  // );

  // console.log("blueblue!!");

  // flameAnimation.draw(ctx, assets.flame, 400, 400, 665, 665);

  // flameAnimation.draw(
  //   ctx,
  //   assets.flame,
  //   0,
  //   0,
  //   665,
  //   665,
  //   world.width / 2,
  //   world.height / 2,
  //   chosenEnemy.pos.x,
  //   chosenEnemy.pos.y
  // );

  const animationCounter = flameAnimation.counter();
  // console.log(animationCounter);

  const imageIndex = Math.floor(animationCounter / flameAnimationStat.slowDown);
  // console.log(flame);

  const spriteWidth = assets.flame.width / flameAnimationStat.imageCount;

  const playerEnemyPosDifference = {
    x: Math.abs(world.width / 2 - chosenPos.x),
    y: Math.abs(world.height / 2 - chosenPos.y),
  };

  // console.log(spriteWidth);
  // ctx.save();
  // ctx.rotate((10 * Math.PI) / 180);
  // ctx.drawImage(
  //   assets.flame,
  //   imageIndex * spriteWidth,
  //   0,
  //   spriteWidth,
  //   // 500,
  //   assets.flame.height,
  //   world.width / 2,
  //   world.height / 2,

  //   chosenPos.x - player.pos.x,
  //   chosenPos.y - player.pos.y
  // );
  // ctx.restore();

  // console.log(chosenEnemy.pos);

  ctx.drawImage(
    assets.flame,
    imageIndex * spriteWidth,
    0,
    spriteWidth,
    // 500,
    assets.flame.height,
    world.width / 2 + player.radius / 2,
    world.height / 2 - assets.flame.height / 1.5,

    chosenPos.x,
    chosenPos.y
  );

  const stepInfo = flameAnimation.step();

  // console.log(stepInfo);

  if (!stepInfo) {
    // console.log(flameAnimationStat.counter);
    requestAnimationFrame(flameThrowerFire);
  } else {
    chosenPos = undefined;
    console.log("gone");

    flameAnimation = animation({
      imageCount: flameAnimationStat.imageCount,
      slowDown: flameAnimationStat.slowDown,
      reverse: false,
      repeat: false,
      vertical: false,
    });
  }
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
