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
  }
  // console.log(attacker, target);
};
