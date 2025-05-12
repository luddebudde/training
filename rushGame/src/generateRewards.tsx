import { nextBoss, spawnDelay } from "./arrays";
import { Player, player } from "./createPlayer";
import { randomArrayElementSplice } from "./randomArrayElement";

type Upgrades = {
  title: string;
  description: string;
  id: string;
  change: (player: Player) => void;
  unlockRequirement: () => Upgrades[];
};

const decreasedDmgBounce: Upgrades = {
  title: "More damage",
  description: "Bouncy bullets lose less damage!",
  id: "bounceDamageLoss",
  change: (player) => {
    player.unlockedAbilities.bounceDamageLoss += 0.3;
  },
  unlockRequirement: () => {
    return [bouncyBullets, dash];
  },
};

const dash: Upgrades = {
  title: "Dash",
  description: "Adds dash ability",
  id: "dash",
  change: (player) => {
    player.unlockedAbilities.dash = true;
  },
  unlockRequirement: () => {
    return [];
  },
};

const bouncyBullets: Upgrades = {
  title: "Bouncy",
  description: "Bouncy bullets!",
  id: "bounceable",
  change: (player) => {
    player.unlockedAbilities.bounceable = true;
  },
  unlockRequirement: () => {
    return [];
  },
};

const extraLife: Upgrades = {
  title: "Extra Life",
  description: "+1 life",
  id: "bonusLife",
  change: (player) => {
    player.unlockedAbilities.bonusLife = true;
  },
  unlockRequirement: () => {
    return [];
  },
};

const adrenaline: Upgrades = {
  title: "Adrenaline",
  description: "Blood is pumping when at low HP!",
  id: "adrenaline",
  change: (player) => {
    player.unlockedAbilities.adrenaline += 0.5;
  },
  unlockRequirement: () => {
    return [];
  },
};

const autoDamage: Upgrades = {
  title: "Auto Damage",
  description: "Deal damage without shooting!",
  id: "autoDamage",
  change: (player) => {
    player.unlockedAbilities.autoDamage += 0.2;
  },
  unlockRequirement: () => {
    return [];
  },
};

const tankie: Upgrades = {
  title: "Made To Tank!",
  description: "More max health, but lower damage",
  id: "tankie",
  change: (player) => {
    player.maxHealth *= 2;
    player.bulletDamage *= 0.65;
  },
  unlockRequirement: () => {
    return [];
  },
};

const totalRewardPool: Upgrades[] = [
  dash,
  bouncyBullets,
  extraLife,
  adrenaline,
  autoDamage,
  decreasedDmgBounce,
  tankie,
];

const usedRewards: Upgrades[] = [];

export const generateRewards = (ctx) => {
  const selectionDiv = document.getElementById("upgradeSelection");
  selectionDiv.style.visibility = "visible";

  const children = selectionDiv.querySelectorAll("*");
  children.forEach((child) => {
    child.style.visibility = "visible";
  });
  const rewardPool = totalRewardPool.filter((reward) => {
    const requirements = reward.unlockRequirement();
    return requirements.every((req) => usedRewards.includes(req));
  });

  let possibleRewards = rewardPool.filter(
    (loopReward) => !usedRewards.includes(loopReward)
  );

  console.log(usedRewards, possibleRewards, rewardPool, "logging rewards");

  for (let i = 1; i < 4; i++) {
    const reward: Upgrades = randomArrayElementSplice(possibleRewards);

    const element = document.getElementById(`option${i}`);
    const children = element.children;

    element.style.visibility = "visible";

    const firstChild = children[0];
    const secondChild = children[1];
    const thirdChild = children[2];

    firstChild.textContent = reward.title;
    thirdChild.textContent = reward.description;

    element.onclick = () => {
      reward.change(player);
      usedRewards.push(reward);

      setTimeout(() => {
        nextBoss(ctx);
      }, spawnDelay * 2);

      console.log(player.unlockedAbilities, reward.title);

      selectionDiv.style.visibility = "hidden";
      const children = selectionDiv.querySelectorAll("*");
      children.forEach((child) => {
        child.style.visibility = "hidden";
      });
    };
  }
};
