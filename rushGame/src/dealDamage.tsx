import { player } from "./createPlayer";

export let damageDealt = 0;
export let damageTaken = 0;

export const dealDamage = (attacker, target, damage: number) => {
  if (attacker.team === player.team) {
    damageDealt += damage;
  }
  if (target === player) {
    damageTaken += damage;
  }

  target.health -= damage;
};
