export const dealDamage = (
  attacker: any,
  target: any,
  damage: number,
  type = "normal"
) => {
  if (type === "contact" && target.iFrame !== undefined) {
    if (target.iFrame > 0) {
      console.log("block", target.iFrame);

      return;
    } else {
      if (target.iFrame !== undefined) {
        target.iFrame = 15;
      }
    }
  }

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
