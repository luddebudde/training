import { currentCharacter } from "./createPlayer.js";

export const stats = {
  growth: currentCharacter.stats.growth,
  greed: currentCharacter.stats.growth,

  movementSpeed: currentCharacter.stats.movementSpeed,

  maxHealth: currentCharacter.stats.maxHealth,
  regeneration: currentCharacter.stats.regen,
  armor: currentCharacter.stats.armor,

  damage: currentCharacter.stats.damage,
  area: currentCharacter.stats.area,
  speed: currentCharacter.stats.speed,

  curse: currentCharacter.stats.curse,
  cooldown: currentCharacter.stats.cooldown,
};

export const upgradeStats = (weapon, statType, amount) => {
  weapon.stats.statType += amount;
  // stats
};
