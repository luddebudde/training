import { stats } from "../stats.js";

export const Blugo = {
  fullname: "Blugo McPlommon",

  stats: {
    growth: 10,
    greed: 1,

    movementSpeed: 5,

    // maxHealth: 100,
    maxHealth: 1,
    regen: 1,
    armor: 1,
    maxShield: 50,
    // shield: 50,
    shield: 0,

    damage: 1,
    area: 1,
    speed: 1,

    curse: 1,
    cooldown: 1,
  },
  levelUpIncrease: () => {
    stats.curse += 0.1;
  },
};
