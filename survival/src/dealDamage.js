import { player } from "./main.js";
import { statistics } from "./statistics.js";
import { stats } from "./stats.js";

export const dealDamage = (
  obj,
  damageType,
  amount,
  creditWeapon = undefined
) => {
  if (obj.invincible === true) {
    console.log(obj.invincible);
    return;
  }

  if (obj.resistance && obj.resistance[damageType] !== undefined) {
    // console.log(amount);
    amount = amount * (1 - obj.resistance[damageType]);
    // console.log(amount);
  }

  if (obj.shield !== undefined && obj.shield > 0) {
    const remainingAmount = obj.shield >= amount ? 0 : amount - obj.shield;
    obj.shield -= amount;
    obj.health -= remainingAmount;
    // console.log(obj.shield);
  } else {
    obj.health -= amount;
  }

  if (obj === player && player.health > 0) {
    statistics.overall.damageTaken += amount;
    statistics.game.damageTaken += amount;
  } else if (obj.team === "enemy") {
    statistics.overall.damage += amount;
    statistics.game.damage += amount;
  }

  if (creditWeapon !== undefined) {
    creditWeapon.statistics.damage += amount;
    obj.statusEffects.courage -= creditWeapon.stats.applyEffect.fear;

    if (obj.statusEffects.courage <= 0) {
      obj.fearMult = -2;
    }

    console.log(obj.statusEffects);

    // const fearMult = walker.statusEffects.courage > 0 ? 1 : -1;

    // const newVel = makeDirection(walker.pos, target.pos);

    // walker.vel.x = newVel.x * walker.speed * fearMult;
    // walker.vel.y = newVel.y * walker.speed * fearMult;

    if (obj.health <= 0) {
      statistics.overall.kills += 1;
      statistics.game.kills += 1;
      creditWeapon.statistics.kills += 1;
    }
  }
};
