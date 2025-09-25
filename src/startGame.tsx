import {
  blackholes,
  bullets,
  changeWaveIndex,
  entities,
  liveBosses,
  nextBoss,
  squares,
} from "./arrays";
import { changeIsPaused } from "./basics";
import { createPlayer } from "./createPlayer";
import { usedRewards } from "./generateRewards";
import { foughtBosses } from "./loseScreen";

export const startGame = (ctx, callBoss = nextBoss) => {
  console.log("creatingGame");

  liveBosses.length = 0;
  bullets.length = 0;
  entities.length = 0;
  foughtBosses.length = 0;
  squares.length = 0;
  blackholes.length = 0;

  usedRewards.length = 0;

  // generateRewards(ctx);
  createPlayer();
  changeWaveIndex(0);
  // setTimeout(() => {
  // nextBoss(ctx);

  callBoss(ctx);
  //     // console.log(player, "player");
  // }, 5000);

  //   console.log(player, "player");

  changeIsPaused(false);
};
