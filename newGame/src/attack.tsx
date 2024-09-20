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
    console.log(attacker.possibleTargets);

    attacker.target = attacker.possibleTargets[0];
    console.log(attacker.target);

    // delete animationsRegistry[target?.id];
    blueSlimeDeath(target);
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
