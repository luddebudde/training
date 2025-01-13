import { spawnBoss, spawnDelay } from "./arrays";
import { player } from "./createPlayer";

const rewardPool = [
  ["Dash", "Adds dash ability", "dash"],
  ["Dash", "Adds dash ability", "dash"],
  ["Bouncy", "Bouncy bullets!", "bounceable"],
  ["Bouncy", "Bouncy bullets!", "bounceable"],
];

export const generateRewards = () => {
  const selectionDiv = document.getElementById("upgradeSelection");
  selectionDiv.style.visibility = "visible";

  let possibleRewards = structuredClone(rewardPool);
  for (let i = 1; i < 4; i++) {
    const reward =
      possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

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

      setTimeout(() => {
        spawnBoss();
      }, spawnDelay * 2);

      selectionDiv.style.visibility = "hidden";
      const children = selectionDiv.querySelectorAll("*");
      children.forEach((child) => {
        child.style.visibility = "hidden"; // Döljer varje barn
      });
    };

    console.log(element);
  }
};
