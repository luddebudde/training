import { currentCharacter } from "./createPlayer.js";

export const stats = {
  growth: currentCharacter.stats.growth,

  movementSpeed: currentCharacter.stats.movementSpeed,

  maxHealth: currentCharacter.stats.maxHealth,
  regen: currentCharacter.stats.regen,
  armor: currentCharacter.stats.armor,
  shield: currentCharacter.stats.shield,

  damage: currentCharacter.stats.damage,
  area: currentCharacter.stats.area,
  speed: currentCharacter.stats.speed,

  curse: currentCharacter.stats.curse,
  cooldown: currentCharacter.stats.cooldown,
};
