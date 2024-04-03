import { levelUpSelection } from "./menu/levelUpSelection.js";
import { player } from "./main.js";
import { playLevelUp, playLevelUpSpecial } from "./sounds.js";

export const levelUp = () => {
  player.xp.level++;
  player.xp.amount -= player.xp.nextLevel;
  player.xp.nextLevel += player.xp.levelIncrease;

  // console.log(player.xp.amount, player.xp.nextLevel);

  player?.levelUpIncrease();

  if (Math.random() <= 0.9995) {
    playLevelUp();
  } else {
    playLevelUpSpecial();
    console.log("levelUp");
  }

  levelUpSelection();
};
