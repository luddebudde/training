import { loopPerSecond } from "./basic.js";
import { player } from "./main.js";
import { stats } from "./stats.js";

let regenCounter = 0;

export const checkRegen = () => {
  regenCounter += 1;
  if (regenCounter % loopPerSecond === 0) {
    if (player.health < stats.maxHealth) {
      player.health += stats.regeneration;
    } else {
      if (stats.shield < stats.maxShield) {
        stats.shield += stats.regeneration / 2;
        console.log("shield");
      }
    }
  }
};
