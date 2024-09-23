import { enemies } from "./enemies/enemyTypes";
import { blueSlimeDeath } from "./enemies/slimeEnemy";
import { animationsRegistry, stopAnimation } from "./playAnimation";

export const attack = (attacker, target, damage) => {
  // if (target.blocking === undefined || !target.blocking) {
  target.health -= damage;
  // } else {
  //   console.log("Block!");
  // }

  if (target.health <= 0) {
    console.log("Dead!");
    // console.log("player targets array", attacker.possibleTargets);

    // console.log("new target", attacker.target);

    // delete animationsRegistry[target?.id];
    blueSlimeDeath(target);

    const index = enemies.indexOf(target);

    if (index !== -1) {
      enemies.splice(index, 1);
    }
    attacker.target = attacker.possibleTargets[0];
    console.log("player targets array", enemies);
  }
  // console.log("Attack", target, attack);

  // for (let i = 0; i < 100; i++) {
  //   setTimeout(() => {
  //     target.pos.x -= 1;
  //     console.log(target.pos);
  //   }, i * 10);
  // }

  // target.pos = { x: 100, y: 100 };
  //   return true;
};
