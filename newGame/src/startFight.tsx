import { changeDivStatus } from "./changeDivStatus";
import { clearArray } from "./clearArray";
import { mapBlocks, pathBlocks } from "./main";
import { player } from "./player";
import { spawnEnemy } from "./spawnEnemy";

export const loopPerSecond = 60;

export const startFight = (infestation) => {
  console.log("ben");

  const div = document.getElementById("mapDiv");
  if (div) {
    div.innerHTML = "";
  }

  player.health = player.maxHealth;
  player.mana = player.mana;

  clearArray(mapBlocks);
  clearArray(pathBlocks);

  changeDivStatus("mapDiv", "display", "none");

  spawnEnemy(infestation);
};
