import { spawnBoss, spawnDelay } from "./arrays";
import { player } from "./createPlayer";
import {
  randomArrayElement,
  randomArrayElementSplice,
} from "./randomArrayElement";

const rewardPool = [
  ["Dash", "Adds dash ability", "dash"],
  ["Bouncy", "Bouncy bullets!", "bounceable"],
  ["Savior", "+1 life", "bonusLife"],
  ["bb", "Bouncy bullets!", "bounceable"],
];

export const generateRewards = () => {
  const selectionDiv = document.getElementById("upgradeSelection");
  selectionDiv.style.visibility = "visible";

  let possibleRewards = structuredClone(rewardPool);
  for (let i = 1; i < 4; i++) {
    const reward = randomArrayElementSplice(possibleRewards);
    // possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

    const element = document.getElementById(`option${i}`);
    const children = element.children; // Hämtar alla barn

    element.style.visibility = "visible";

    const firstChild = children[0];
    const secondChild = children[1];
    const thirdChild = children[2];

    firstChild.textContent = reward[0];
    thirdChild.textContent = reward[1];

    element.onclick = () => {
      player.unlockedAbilities[reward[2]] = true;
      console.log(player.unlockedAbilities);

      setTimeout(() => {
        spawnBoss();
      }, spawnDelay * 2);

      selectionDiv.style.visibility = "hidden";
      const children = selectionDiv.querySelectorAll("*");
      children.forEach((child) => {
        child.style.visibility = "hidden";
      });
    };
  }
};
