export const dealDamage = (attacker, target, damage: number) => {
  if (attacker.team !== target.team) {
    attacker.damageConflicted += damage;
    target.absorbedDamage += damage;
    target.health -= damage;
  }
  // console.log(attacker.damageConflicted, target.absorbedDamage);
};
