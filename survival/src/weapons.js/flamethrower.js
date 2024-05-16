import { animation } from "../animation.js";
import { closestObject } from "../closestObject.js";
import { createSplatter } from "../createOilSplater.js";
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
import { removeFromArrays } from "../removeFromArrays.js";
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
    damage: 0,
    cooldown: 100,
    pierce: 100000,
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
  slowDown: 30,
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
    speed = stats.speed * flamethrowerStats.fireMode.speed * 1;
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
      draw: drawFlameThrowerFire,

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

const drawFlameThrowerFire = (ctx, assets, object) => {
  // console.log(chosenEnemy);

  if (chosenPos === undefined) {
    const chosenIndex = Math.floor(Math.random() * enemies.length);
    const chosenEnemy = enemies[chosenIndex];
    chosenPos = { x: chosenEnemy.pos.x, y: chosenEnemy.pos.y };
  }

  console.log();

  flameAnimation.step();

  const animationCounter = flameAnimation.counter();

  const spriteWidth = assets.flame.width / flameAnimationStat.imageCount;

  const playerEnemyPosDifference = {
    x: Math.abs(world.width / 2 - chosenPos.x),
    y: Math.abs(world.height / 2 - chosenPos.y),
  };

  const diff = vector.eachOther.sub(object.pos, player.pos);
  const dist = vector.alone.norm(diff);

  // console.log(object.pos);

  const n = Math.round(dist / (object.radius * 2));

  const dir = vector.alone.normalised(diff);

  const enemyDiff = vector.eachOther.sub(player.pos, chosenPos);
  const enemyDist = vector.alone.norm(enemyDiff);

  if (enemyDist < dist) {
    // removeFromArrays(object);
    console.log("returend");
    object.destroy = true;
    // return;
  }

  console.log(dist, enemyDist);

  // console.log(dir);
  Array(n)
    .fill(0)
    .map((_, i) => {
      return vector.eachOther.add(
        player.pos,
        vector.alone.mult(dir, i * object.radius * 2)
      );
    })
    .forEach((pos, i) => {
      // console.log(pos);
      const r = object.radius * i * 0.25;
      // const r = object.radius * (1 + Math.pow(i * 0.1, 2));
      const imageIndex = Math.floor(
        (animationCounter + i) / flameAnimationStat.slowDown
      );
      ctx.drawImage(
        assets.flame,
        // image coordinates
        imageIndex * spriteWidth,
        0,
        // image height
        spriteWidth,
        assets.flame.height,
        // world coordinates
        pos.x - r,
        pos.y - r,

        // world width
        r * 2,
        r * 2
      );
    });

  const stepInfo = flameAnimation.step();

  // console.log(stepInfo);

  if (!stepInfo) {
    // console.log("hello");
    // console.log(flameAnimationStat.counter);
    // flameThrowerFire();
  } else {
    // chosenPos = undefined;
    // // console.log("gone");
    // flameAnimation = animation({
    //   imageCount: flameAnimationStat.imageCount,
    //   slowDown: flameAnimationStat.slowDown,
    //   reverse: false,
    //   repeat: false,
    //   vertical: false,
    // });
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
