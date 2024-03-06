import { loopPerSecond } from "./basic.js";
import { player } from "./main.js";
import { stats } from "./stats.js";

let regenCounter = 0;

export const checkRegen = () => {
  if (player.health > stats.maxHealth) {
    player.health = stats.maxHealth;
  }
  regenCounter += 1;
  if (regenCounter % loopPerSecond === 0) {
    if (player.health < stats.maxHealth) {
      player.health += stats.regeneration;
    } else {
      // console.log(player.shield);
      if (player.shield < player.maxShield) {
        player.shield += stats.regeneration / 2;
        // console.log("shield 2");
      }
    }
  }
};
