import { changeDivStatus } from "./changeDivStatus";
import { clearArray } from "./clearArray";
import { mapBlocks, pathBlocks } from "./main";
import { spawnEnemy } from "./spawnEnemy";

export const loopPerSecond = 60;

export const startFight = (infestation) => {
  console.log("ben");

  const div = document.getElementById("mapDiv");
  if (div) {
    div.innerHTML = "";
  }

  clearArray(mapBlocks);
  clearArray(pathBlocks);

  changeDivStatus("mapDiv", "display", "none");

  spawnEnemy(infestation);
};
