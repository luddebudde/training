import { stats } from "./stats.js";

export const dealDamage = (obj, damageType, amount) => {
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
};