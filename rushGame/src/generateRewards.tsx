import { player } from "./createPlayer";

const rewardPool = ["dash", "dash", "bounceable", "bounceable"];

export const generateRewards = () => {
  const selectionDiv = document.getElementById("upgradeSelection");
  selectionDiv.style.visibility = "visible";

  let possibleRewards = structuredClone(rewardPool);
  for (let i = 1; i < 4; i++) {
    const reward =
      possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

    const element = document.getElementById(`option${i}`);
    element.textContent = reward;

    element.onclick = () => {
      player.unlockedAbilities[reward] = true;

      selectionDiv.style.visibility = "hidden";
    };

    console.log(element);
  }
};
