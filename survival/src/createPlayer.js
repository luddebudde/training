import { Blugo } from "./characters.js/Blugo.js";
import { Ludwigo } from "./characters.js/Ludwigo.js";
import { Pelin } from "./characters.js/Pelin.js";
import { stats } from "./stats.js";
import { world, worldsizeMultiplier } from "./world.js";

export const currentCharacter = Blugo;

export const createPlayer = () => {
  return {
    character: currentCharacter,
    maxHealth: stats.maxHealth,
    health: stats.maxHealth,
    // health: 0,
    maxShield: currentCharacter.stats.maxShield,
    shield: currentCharacter.stats.shield,
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      x: 0,
      y: 0,
    },
    xp: {
      // amount: 1000,
      amount: 0,
      level: 1,
      // nextLevel: 100,
      nextLevel: 1000,
      levelIncrease: 100,
      // levelIncrease: 50000,
    },
    levelUpIncrease: currentCharacter.levelUpIncrease,

    eggCount: 0,
    gold: 0,
    speed: stats.movementSpeed * worldsizeMultiplier,
    // startRadius: 40,
    radius: 40 * worldsizeMultiplier,
    // health: 100,
    color: "blue",
    team: "player",
    priority: 100,
    pullForceBonus: -500000,
  };
};
