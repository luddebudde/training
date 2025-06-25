export const dealDamage = (attacker, target, damage: number) => {
  // const attackerTeam = attacker === undefined ? "" : attacker.team;
  target.health -= damage;
  if ("damageConflicted" in attacker && "damageAbsorbed" in target) {
    attacker.damageConflicted += damage;
    target.damageAbsorbed += damage;
  }

  if (target.health <= 0 && target.onDeath !== undefined) {
    target.onDeath();
    console.log("dead");
  }
  // console.log(attacker, target);
};
