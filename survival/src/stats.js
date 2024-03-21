import { currentCharacter } from "./createPlayer.js";
import { worldsizeMultiplier } from "./world.js";

export const stats = {
  growth: currentCharacter.stats.growth,
  greed: currentCharacter.stats.growth,

  movementSpeed: currentCharacter.stats.movementSpeed,

  maxHealth: currentCharacter.stats.maxHealth,
  regeneration: currentCharacter.stats.regen,
  armor: currentCharacter.stats.armor,

  damage: currentCharacter.stats.damage,
  area: currentCharacter.stats.area * 0.001,
  speed: currentCharacter.stats.speed,

  luck: currentCharacter.stats.luck,
  curse: currentCharacter.stats.curse,
  cooldown: currentCharacter.stats.cooldown,
  revives: currentCharacter.stats.revives,
};

export const upgradeStats = (weapon, statType, amount) => {
  weapon.stats.statType += amount;
  // stats
};
