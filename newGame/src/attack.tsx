export const attack = (attacker, target, damage) => {
  if (!target.blocking) {
    target.health -= damage;
  } else {
    console.log("Block!");
  }

  if (target.health <= 0) {
    console.log("Dead!");
    attacker.target = attacker.possibleTargets[0];
  }
  console.log("Attack", target, attack);

  target.pos = { x: 100, y: 100 };
  //   return true;
};
