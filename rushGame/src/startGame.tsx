import {
  bullets,
  changeWaveIndex,
  entities,
  liveBosses,
  nextBoss,
  squares,
} from "./arrays";
import { createPlayer, player, standardPlayer } from "./createPlayer";
import { changeIsPaused } from "./basics";
import { foughtBosses } from "./loseScreen";
import { generateRewards, usedRewards } from "./generateRewards";

export const startGame = (ctx) => {
  console.log("creatingGame");

  liveBosses.length = 0;
  bullets.length = 0;
  entities.length = 0;
  foughtBosses.length = 0;
  squares.length = 0;

  usedRewards.length = 0;

  generateRewards(ctx);
  createPlayer();
  changeWaveIndex(0);
  setTimeout(() => {
    // nextBoss(ctx);
    //     // console.log(player, "player");
  }, 1500);

  //   console.log(player, "player");

  changeIsPaused(false);
};
