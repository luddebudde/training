export const dealDamage = (attacker: any, target: any, damage: number) => {
  // const attackerTeam = attacker === undefined ? "" : attacker.team;
  target.health -= damage;

  if (target.health <= 0 && target.onDeath !== undefined) {
    target.onDeath();
    console.log("dead");
  }

  if (attacker !== undefined) {
    if ("damageConflicted" in attacker && "damageAbsorbed" in target) {
      attacker.damageConflicted += damage;
      target.damageAbsorbed += damage;
    }

    if (attacker.lifeSteal !== undefined) {
      attacker.health += damage * attacker.lifeSteal;
    }
  }

  // console.log(attacker, target);
};
