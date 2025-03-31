export const dealDamage = (attacker, target, damage: number) => {
  attacker.damageConflicted += damage;
  target.absorbedDamage += damage;
  target.health -= damage;

  // console.log(attacker.damageConflicted, target.absorbedDamage);
};
