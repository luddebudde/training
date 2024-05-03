import { animation } from "../animation.js";
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
    cooldown: 20,
    pierce: 1,
    special: 0,
  },
  oilMode: {
    area: 30,
    splatterArea: 300,
    speed: 20,
    damage: 0,
    cooldown: 10,
    pierce: 0,
    special: 0,
  },
};

export const burningAnimation = animation({
  imageCount: 12,
  slowDown: 20,
  reverse: false,
  repeat: true,
});

export const createFlamethrower = () => {
  let area;
  let speed;
  let damage;
  let cooldown;
  let pierce;
  let splatterArea = 1;
  let onHit;

  if (flamethrower.modeValue % 2 === 0) {
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
  } else {
    // Fire mode
    flamethrower.attackIntervall = flamethrowerStats.fireMode.cooldown;
    area = stats.area * flamethrowerStats.fireMode.area;
    speed = stats.speed * flamethrowerStats.fireMode.speed;
    damage = stats.damage * flamethrowerStats.fireMode.damage;
    cooldown = stats.cooldown * flamethrowerStats.fireMode.cooldown;
    pierce = stats.cooldown * flamethrowerStats.fireMode.pierce;

    onHit = (enemy) => {
      //   ctx.drawImage(
      //     assets.blue,
      //     walker.pos.x - walker.radius,
      //     walker.pos.y - walker.radius,
      //     walker.radius * 2,
      //     walker.radius * 2
      //   );

      enemy.statusEffects.oiled = false;
      enemy.statusEffects.burning = true;
    };
  }

  const direction = makeDirection(mousePos, {
    x: world.width / 2,
    y: world.height / 2,
  });
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
