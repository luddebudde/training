import { loopPerSecond } from "./basic.js";
import { player } from "./main.js";
import { makeDirection } from "./makeDirection.js";

export let knockbackEnemies = [];

export const applyKnockback = (obj, duration, weaponKnockbackMult = 1) => {
  const knockbackMult = 1 / duration;

  obj.knockback.counter =
    (loopPerSecond * knockbackMult * obj.knockback.mult * weaponKnockbackMult) /
    5;

  knockbackEnemies.push(obj);
  obj.orignalSpeed = obj.speed;

  obj.speed = -3 * obj.knockback.mult;
};

export const checkKnockbackCounter = (obj, objIndex) => {
  if (obj.knockback.counter <= 0) {
    knockbackEnemies.splice(objIndex, 1);

    obj.speed = obj.orignalSpeed;
  }
  obj.knockback.counter--;
};
