import { stats } from "../stats.js";

const aimBulletStats = {
  area: 20,
  speed: 20,
  damage: 20,
  cooldown: 25,
};

const createAimBullet = () => {
  //   console.log("tja");
};

export const colin = {
  name: "colin",
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: aimBulletStats.cooldown * stats.cooldown,
  cooldown: aimBulletStats.cooldown * stats.cooldown,
  attack: createAimBullet,

  update: () => {
    colin.attackIntervall = aimBulletStats.cooldown * stats.cooldown;
  },

  stats: aimBulletStats,

  upgrades: {
    level: 0,
    statsOrder: ["cooldown", "speed", "damage", "area", "speed", "damage"],
    amountOrder: [-10, 1, 1, 5, 5, 5],
  },
};

export const loka = {
  name: "loka",
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: aimBulletStats.cooldown * stats.cooldown,
  cooldown: aimBulletStats.cooldown * stats.cooldown,
  attack: createAimBullet,

  update: () => {
    loka.attackIntervall = aimBulletStats.cooldown * stats.cooldown;
  },

  stats: aimBulletStats,

  upgrades: {
    level: 0,
    statsOrder: ["cooldown", "speed", "damage", "area", "speed", "damage"],
    amountOrder: [-10, 1, 1, 5, 5, 5],
  },
};

export const buba = {
  name: "buba",
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: aimBulletStats.cooldown * stats.cooldown,
  cooldown: aimBulletStats.cooldown * stats.cooldown,
  attack: createAimBullet,

  update: () => {
    buba.attackIntervall = aimBulletStats.cooldown * stats.cooldown;
  },

  stats: aimBulletStats,

  upgrades: {
    level: 0,
    statsOrder: ["cooldown", "speed", "damage", "area", "speed", "damage"],
    amountOrder: [-10, 1, 1, 5, 5, 5],
  },
};

export const jedå = {
  name: "jedå",
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: aimBulletStats.cooldown * stats.cooldown,
  cooldown: aimBulletStats.cooldown * stats.cooldown,
  attack: createAimBullet,

  update: () => {
    jedå.attackIntervall = aimBulletStats.cooldown * stats.cooldown;
  },

  stats: aimBulletStats,

  upgrades: {
    level: 0,
    statsOrder: ["cooldown", "speed", "damage", "area", "speed", "damage"],
    amountOrder: [-10, 1, 1, 5, 5, 5],
  },
};

export const uluk = {
  name: "uluk",
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: aimBulletStats.cooldown * stats.cooldown,
  cooldown: aimBulletStats.cooldown * stats.cooldown,
  attack: createAimBullet,

  update: () => {
    uluk.attackIntervall = aimBulletStats.cooldown * stats.cooldown;
  },

  stats: aimBulletStats,

  upgrades: {
    level: 0,
    statsOrder: ["cooldown", "speed", "damage", "area", "speed", "damage"],
    amountOrder: [-10, 1, 1, 5, 5, 5],
  },
};
