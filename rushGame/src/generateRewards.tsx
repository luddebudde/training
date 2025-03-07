import { nextBoss, spawnDelay } from "./arrays";
import { player } from "./createPlayer";
import {
  randomArrayElement,
  randomArrayElementSplice,
} from "./randomArrayElement";

type UpgradeRewards = {
  title: string;
  description: string;
  id: string;
  changeTo: boolean | number;
};

const dashUpgrade = {
  title: "Dash",
  description: "Adds dash ability",
  id: "dash",
  changeTo: true,
  // unlocks:
};

const bouncyBulletsUpgrade = {
  title: "Bouncy",
  description: "Bouncy bullets!",
  id: "bounceable",
  changeTo: true,
  // unlocks:
};

const extraLifeUpgrade = {
  title: "Extra Life",
  description: "+1 life",
  id: "bonusLife",
  changeTo: true,
  // unlocks:
};

const adrenalineUpgrade = {
  title: "Adrenaline",
  description: "Blood is pumping when at low HP!",
  id: "adrenaline",
  changeTo: 0.5,
  // unlocks:
};

const rewardPool = [
  dashUpgrade,
  bouncyBulletsUpgrade,
  extraLifeUpgrade,
  adrenalineUpgrade,
];

export const generateRewards = () => {
  const selectionDiv = document.getElementById("upgradeSelection");
  selectionDiv.style.visibility = "visible";

  let possibleRewards = structuredClone(rewardPool);
  for (let i = 1; i < 4; i++) {
    const reward = randomArrayElementSplice(possibleRewards);

    const element = document.getElementById(`option${i}`);
    const children = element.children; // Hämtar alla barn

    element.style.visibility = "visible";

    const firstChild = children[0];
    const secondChild = children[1];
    const thirdChild = children[2];

    firstChild.textContent = reward.title;
    thirdChild.textContent = reward.description;

    element.onclick = () => {
      player.unlockedAbilities[reward.id] = reward.changeTo;
      console.log(player.unlockedAbilities);

      setTimeout(() => {
        nextBoss();
      }, spawnDelay * 2);

      selectionDiv.style.visibility = "hidden";
      const children = selectionDiv.querySelectorAll("*");
      children.forEach((child) => {
        child.style.visibility = "hidden";
      });
    };
  }
};
