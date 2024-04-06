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
  area: currentCharacter.stats.area,
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

export const resetStats = (character) => {
  stats.growth = character.stats.growth;
  stats.greed = character.stats.growth;
  stats.movementSpeed = character.stats.movementSpeed;
  stats.maxHealth = character.stats.maxHealth;
  stats.maxShield = character.stats.maxShield;
  stats.regeneration = character.stats.regen;
  stats.armor = character.stats.armor;
  stats.damage = character.stats.damage;
  stats.area = character.stats.area * worldsizeMultiplier;
  stats.speed = character.stats.speed * worldsizeMultiplier;
  stats.curse = character.stats.curse;
  stats.cooldown = character.stats.cooldown;

  stats.luck = character.stats.luck;
  stats.revives = character.stats.revives;
};
