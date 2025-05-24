export const dealDamage = (attacker, target, damage: number) => {
  // const attackerTeam = attacker === undefined ? "" : attacker.team;
  target.health -= damage;
  if (
    attacker &&
    target &&
    "team" in attacker &&
    "team" in target &&
    "damageConflicted" in attacker &&
    "absorbedDamage" in target &&
    "health" in target &&
    attacker.team !== target.team
  ) {
    attacker.damageConflicted += damage;
    target.absorbedDamage += damage;
  }
};
