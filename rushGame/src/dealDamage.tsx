export const dealDamage = (attacker, target, damage: number) => {
  // const attackerTeam = attacker === undefined ? "" : attacker.team;
  target.health -= damage;
  if ("damageConflicted" in attacker && "damageAbsorbed" in target) {
    attacker.damageConflicted += damage;
    target.damageAbsorbed += damage;
  }

  // console.log(attacker);
};
