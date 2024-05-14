import { loopPerSecond } from "../basic.js";
import { createExplosion } from "../createExplosion.js";
import { createSplatter } from "../createOilSplater.js";
import { dealDamage } from "../dealDamage.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  ctx,
  enemies,
  isKeyDown,
  isMouseDown,
  mousePos,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import {
  playFullyChargedShot,
  playChargingShot,
  playStrongChargedShot,
  playWeakChargedShot,
} from "../sounds.js";
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";
import { world } from "../world.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;
let alreadyIncreasedPierce = true;

const devistatorStats = {
  area: 10,
  speed: 5,
  damage: 0,
  cooldown: 1,
  //   pierce: 5,
  special: 0,

  increasementSize: 5 / loopPerSecond,
  increasementSpeed: 2 / loopPerSecond,
  increasementDamage: 10 / loopPerSecond,
  pierceThreashold: 50,

  chargeSize: 0,
  chargeSpeed: 0,
  chargeDamage: 0,
  chargePierce: 0,
  chargeCap: loopPerSecond * 5,
};

let canChangeMode = false;
let timeCharged = 0;

export const createDevistateBullet = () => {
  // console.log(aimBullet.area);
  const baseArea = stats.area * devistatorStats.area;
  const baseSpeed = stats.speed * devistatorStats.speed;
  const baseDamage = stats.damage * devistatorStats.damage;
  const cooldown = stats.cooldown * devistatorStats.cooldown;

  if (isMouseDown) {
    if (timeCharged === devistatorStats.chargeCap) {
      playFullyChargedShot();
    }
    if (
      timeCharged <= devistatorStats.chargeCap ||
      devistatorStats.special > 0
    ) {
      devistatorStats.chargeDamage += devistatorStats.increasementDamage;
      devistatorStats.chargeSize += devistatorStats.increasementSize;
      devistatorStats.chargeSpeed += devistatorStats.increasementSpeed;

      //   if (!checkIfPlaying()) {
      //     playChargingShot.play();
      //   }

      if (timeCharged > loopPerSecond / 2) playChargingShot();

      if (
        Math.floor(devistatorStats.chargeDamage) %
          devistatorStats.pierceThreashold ===
        0
      ) {
        if (!alreadyIncreasedPierce) {
          devistatorStats.chargePierce += 1;
          alreadyIncreasedPierce = true;

          console.log(
            devistatorStats.chargeDamage,
            devistatorStats.chargePierce
          );
        }
      } else {
        alreadyIncreasedPierce = false;
      }
      timeCharged += 1;
      canChangeMode = true;
    }
  } else if (canChangeMode) {
    if (timeCharged >= devistatorStats.chargeCap) {
      playStrongChargedShot();
    } else {
      playWeakChargedShot();
    }

    const direction = makeDirection(mousePos, {
      x: world.width / 2,
      y: world.height / 2,
    });
    const bullet = {
      radius: baseArea + devistatorStats.chargeSize * stats.area,
      attackIntervall: cooldown,
      cooldown: cooldown,
      destroy: false,
      pos: {
        x: player.pos.x,
        y: player.pos.y,
      },
      vel: {
        x:
          -direction.x *
          (baseSpeed + devistatorStats.chargeSpeed * stats.speed),
        y:
          -direction.y *
          (baseSpeed + devistatorStats.chargeSpeed * stats.speed),
      },
      damage: baseDamage + devistatorStats.chargeDamage * stats.damage,
      color: "purple",
      team: "player",
      priority: 5,

      enemiesHit: [],
      pierce: devistatorStats.chargePierce,
      weapon: devistator,
    };
    bullets.push(bullet);

    (devistatorStats.chargeSize = 0),
      (devistatorStats.chargeSpeed = 0),
      (devistatorStats.chargeDamage = 0),
      (devistatorStats.chargePierce = 0),
      (timeCharged = 0);
    canChangeMode = false;
  }
};

export const devistator = {
  name: "devistator",
  timesTaken: 0,
  unlockRequirement: () => {},
  // image: assets.rhino,
  image: await loadImage(`public/sprites/skull.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: devistatorStats.cooldown * stats.cooldown,
  cooldown: devistatorStats.cooldown * stats.cooldown,
  attack: createDevistateBullet,

  update: () => {
    devistator.attackIntervall = devistatorStats.cooldown * stats.cooldown;
  },

  stats: devistatorStats,

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  upgrades: {
    level: 0,
    statsOrder: [
      // 1
      ["increasementDamage", "pierceThreashold"],
      //   2
      ["increasementSpeed, increasementArea"],
      //   3
      ["chargeCap"],
      //   4
      ["increasementDamage"],
      //   5
      ["increasementSpeed, increasementArea"],
      //   6
      ["increasementDamage", "pierceThreashold"],
      //   7
      ["area", "speed", "damage"],
      //   8
      ["increasementDamage", "pierceThreashold"],
      //   9
      ["special"],
    ],
    amountOrder: [
      //   1
      [3 / loopPerSecond, -10],
      //   2
      [0.5 / loopPerSecond, 2 / loopPerSecond],
      //   3
      [loopPerSecond * 5],
      //   4
      [2 / loopPerSecond],
      //   5
      [0.5, 2 / loopPerSecond],
      //   6
      [5 / loopPerSecond, -10],
      //   7
      [5, 8, 20],
      //   8
      [10 * loopPerSecond, -20],
      // 9
      [1],
    ],

    description: [
      // 1
      "Increases damage and pierce /second",
      //   2
      "Increases the speed and area /second",
      //   3
      "Increases charge cap, allowing longer charges",
      //   4
      "Increases the damage",
      //   5
      "Increases the speed even further",
      //   6
      "Adds special ability",
      //   7
      "Increases all base stats",
      // 8
      "Remove charge cap",
      // 9
    ],
  },
};
