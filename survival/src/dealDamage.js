import { healthArrays, player } from "./main.js";
import { statistics } from "./statistics.js";
import { stats } from "./stats.js";

export const dealDamage = (
  obj,
  damageType,
  amount,
  creditWeapon = undefined
) => {
  if (obj.resistance && obj.resistance[damageType] !== undefined) {
    amount = amount / obj.resistance.strength;
  }

  if (obj.shield !== undefined && obj.shield > 0) {
    const remainingAmount = obj.shield >= amount ? 0 : amount - obj.shield;
    obj.shield -= amount;
    obj.health -= remainingAmount;
    // console.log(obj.shield);
  } else {
    obj.health -= amount;
  }

  if (obj === player) {
    statistics.overall.damageTaken += amount;
    statistics.game.damageTaken += amount;
  } else if (obj.team === "enemy") {
    statistics.overall.damage += amount;
    statistics.game.damage += amount;
  }

  if (creditWeapon !== undefined) {
    creditWeapon.statistics.damage += amount;

    if (obj.health <= 0) {
      statistics.overall.kills += 1;
      statistics.game.kills += 1;
      creditWeapon.statistics.kills += 1;
    }
  }
};
