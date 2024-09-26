import { enemies } from "./enemies/enemyTypes";
import { blueSlimeDeath } from "./enemies/slimeEnemy";
import { player } from "./player";

export const attack = (attacker, target, damage) => {
  if (target.isBlocking === undefined || target.isBlocking === false) {
    target.health -= damage;
  } else {
    console.log("Block!");
    target.attackDelay = 0;
  }

  if (target.health <= 0) {
    console.log("Dead!");
    target?.deathAnimation?.(target);

    const index = enemies.indexOf(target);

    if (index !== -1) {
      enemies.splice(index, 1);
    }

    attacker.target = attacker.possibleTargets[0];
    console.log("player targets array", enemies);
  }
};
