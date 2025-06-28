import { nextBoss, spawnDelay } from "./arrays";
import { Player, player } from "./createPlayer";
import { randomArrayElementSplice } from "./randomArrayElement";

// iDEA:
// An upgrade which allows you to skip 1 random boss each stage

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
    player.unlockedAbilities.autoDamage += 0.4;
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

const shotGunner: Upgrades = {
  title: "Shotgunner",
  description: "Overall dmg buff, but spread out to 3 shots",
  id: "shotgun",
  change: (player) => {
    player.unlockedAbilities.spreadShotCount += 3;
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
  shotGunner,
];

export const usedRewards: Upgrades[] = [];

export const generateRewards = (ctx) => {
  const selectionDiv = document.getElementById("upgradeSelection");
  selectionDiv.style.visibility = "visible";

  const rewardPool = totalRewardPool.filter((reward) => {
    const requirements = reward.unlockRequirement();
    return requirements.every((req) => usedRewards.includes(req));
  });

  let possibleRewards: Upgrades[] = rewardPool.filter(
    (loopReward) => !usedRewards.includes(loopReward)
  );

  for (let i = 1; i < 4; i++) {
    const reward: Upgrades = randomArrayElementSplice(possibleRewards);
    const currentElement = document.getElementById(`option${i}`);

    const subElements = currentElement.children;

    currentElement.style.visibility = "visible";

    const titleElement = subElements[0]; // Select Title
    const imageElement = subElements[1]; // Select Image
    const descriptionElement = subElements[2]; // Select Description

    titleElement.textContent = reward.title;
    descriptionElement.textContent = reward.description;
    const children = selectionDiv.querySelectorAll("*");
    children.forEach((child) => {
      child.style.visibility = "visible";
    });

    currentElement.onclick = () => {
      reward.change(player);
      usedRewards.push(reward);

      selectionDiv.style.visibility = "hidden";
      const children = selectionDiv.querySelectorAll("*");
      children.forEach((child) => {
        child.style.visibility = "hidden";
      });

      setTimeout(() => {
        nextBoss(ctx);
      }, spawnDelay * 2);
    };
  }
};
