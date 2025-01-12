import { spawnBoss, spawnDelay } from "./arrays";
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

      setTimeout(() => {
        // const spawnStartTime = Date.now();
        // const timerInterval = setInterval(() => {
        //   const elapsedTime = Date.now() - spawnStartTime;
        //   const timeLeft = Math.max(0, spawnDelay * 2 - elapsedTime);

        //   // Rita ut återstående tid
        //   console.log(`Tid kvar: ${Math.ceil(timeLeft / 1000)} sekunder`);

        //   if (timeLeft <= 0) {
        //     clearInterval(timerInterval); // Stoppa timern när tiden är slut
        //   }
        // }, 100);

        spawnBoss();
      }, spawnDelay * 2);

      selectionDiv.style.visibility = "hidden";
    };

    console.log(element);
  }
};
